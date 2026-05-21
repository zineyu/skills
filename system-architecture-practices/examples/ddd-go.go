package main

import (
	"context"
	"fmt"
	"time"
)

// Domain Layer - pure business logic, no external dependencies

// Value Object
type Money struct {
	Amount   int
	Currency string
}

func NewMoney(amount int, currency string) Money {
	if amount < 0 {
		panic("amount cannot be negative")
	}
	return Money{Amount: amount, Currency: currency}
}

func (m Money) Add(other Money) Money {
	if m.Currency != other.Currency {
		panic("cannot add different currencies")
	}
	return NewMoney(m.Amount+other.Amount, m.Currency)
}

func (m Money) Times(factor int) Money {
	return NewMoney(m.Amount*factor, m.Currency)
}

// Entity
type OrderID string
type ProductID string

type OrderItem struct {
	ProductID ProductID
	Price     Money
	Quantity  int
}

type Order struct {
	id     OrderID
	items  []OrderItem
	status OrderStatus
}

type OrderStatus int

const (
	OrderStatusPending OrderStatus = iota
	OrderStatusPaid
	OrderStatusShipped
	OrderStatusCancelled
)

func NewOrder(id OrderID) *Order {
	return &Order{
		id:     id,
		items:  make([]OrderItem, 0),
		status: OrderStatusPending,
	}
}

func (o *Order) AddItem(productID ProductID, price Money, quantity int) error {
	if o.status != OrderStatusPending {
		return fmt.Errorf("can only add items to pending orders")
	}
	if quantity <= 0 {
		return fmt.Errorf("quantity must be positive")
	}
	o.items = append(o.items, OrderItem{
		ProductID: productID,
		Price:     price,
		Quantity:  quantity,
	})
	return nil
}

func (o *Order) Cancel() error {
	if o.status == OrderStatusShipped {
		return fmt.Errorf("cannot cancel shipped orders")
	}
	o.status = OrderStatusCancelled
	return nil
}

func (o *Order) Total() Money {
	total := NewMoney(0, "USD")
	for _, item := range o.items {
		total = total.Add(item.Price.Times(item.Quantity))
	}
	return total
}

// Domain Event
type DomainEvent interface {
	OccurredOn() time.Time
}

type OrderPlaced struct {
	occurredOn time.Time
	OrderID    OrderID
	Total      Money
}

func (e OrderPlaced) OccurredOn() time.Time { return e.occurredOn }

// Repository Interface (Port)
type OrderRepository interface {
	FindByID(ctx context.Context, id OrderID) (*Order, error)
	Save(ctx context.Context, order *Order) error
}

// Domain Service
type PricingService struct{}

func (s *PricingService) CalculateDiscount(order *Order, customerType string) Money {
	if customerType == "VIP" {
		return order.Total().Times(10).Times(1) // 10% discount
	}
	return NewMoney(0, "USD")
}

// Application Layer - orchestrates use cases

type PlaceOrderCommand struct {
	CustomerID string
	Items      []OrderItemCommand
}

type OrderItemCommand struct {
	ProductID string
	Price     int
	Quantity  int
}

type PlaceOrderUseCase struct {
	orderRepo OrderRepository
}

func NewPlaceOrderUseCase(orderRepo OrderRepository) *PlaceOrderUseCase {
	return &PlaceOrderUseCase{orderRepo: orderRepo}
}

func (uc *PlaceOrderUseCase) Execute(ctx context.Context, cmd PlaceOrderCommand) (*Order, error) {
	order := NewOrder(OrderID(fmt.Sprintf("order-%d", time.Now().UnixNano())))

	for _, item := range cmd.Items {
		if err := order.AddItem(ProductID(item.ProductID), NewMoney(item.Price, "USD"), item.Quantity); err != nil {
			return nil, fmt.Errorf("add item: %w", err)
		}
	}

	if err := uc.orderRepo.Save(ctx, order); err != nil {
		return nil, fmt.Errorf("save order: %w", err)
	}

	return order, nil
}

// Infrastructure Layer - adapters

type InMemoryOrderRepository struct {
	orders map[OrderID]*Order
}

func NewInMemoryOrderRepository() *InMemoryOrderRepository {
	return &InMemoryOrderRepository{
		orders: make(map[OrderID]*Order),
	}
}

func (r *InMemoryOrderRepository) FindByID(ctx context.Context, id OrderID) (*Order, error) {
	order, exists := r.orders[id]
	if !exists {
		return nil, fmt.Errorf("order not found: %s", id)
	}
	return order, nil
}

func (r *InMemoryOrderRepository) Save(ctx context.Context, order *Order) error {
	r.orders[order.id] = order
	return nil
}

// Example usage
func main() {
	ctx := context.Background()
	repo := NewInMemoryOrderRepository()
	useCase := NewPlaceOrderUseCase(repo)

	order, err := useCase.Execute(ctx, PlaceOrderCommand{
		CustomerID: "customer-1",
		Items: []OrderItemCommand{
			{ProductID: "prod-1", Price: 1000, Quantity: 2}, // $10.00 * 2
			{ProductID: "prod-2", Price: 500, Quantity: 1},  // $5.00 * 1
		},
	})

	if err != nil {
		panic(err)
	}

	fmt.Printf("Order created: %s, Total: $%.2f\n", order.id, float64(order.Total().Amount)/100)
}