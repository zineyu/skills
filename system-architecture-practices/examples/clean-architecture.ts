// Clean Architecture Implementation Example (TypeScript)
// Domain Layer - no external dependencies

// Value Object
export class Money {
  constructor(
    readonly amount: number,
    readonly currency: string
  ) {
    if (amount < 0) throw new Error('Amount cannot be negative')
  }

  static dollar(amount: number): Money {
    return new Money(amount, 'USD')
  }

  static zero(): Money {
    return new Money(0, 'USD')
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies')
    }
    return new Money(this.amount + other.amount, this.currency)
  }

  times(factor: number): Money {
    return new Money(this.amount * factor, this.currency)
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency
  }
}

// Entity
export class AccountId {
  constructor(readonly value: string) {}
}

export class Activity {
  constructor(
    readonly id: string,
    readonly ownerAccountId: AccountId,
    readonly sourceAccountId: AccountId,
    readonly targetAccountId: AccountId,
    readonly timestamp: Date,
    readonly money: Money
  ) {}
}

export class Account {
  private activities: Activity[] = []

  constructor(
    readonly id: AccountId,
    readonly baselineBalance: Money
  ) {}

  addActivity(activity: Activity): void {
    this.activities.push(activity)
  }

  calculateBalance(): Money {
    return this.baselineBalance.add(
      this.activities.reduce((sum, activity) => sum.add(activity.money), Money.zero())
    )
  }

  withdraw(money: Money, targetAccountId: AccountId): boolean {
    if (!this.mayWithdraw(money)) return false

    const withdrawal = new Activity(
      crypto.randomUUID(),
      this.id,
      this.id,
      targetAccountId,
      new Date(),
      money
    )
    this.addActivity(withdrawal)
    return true
  }

  deposit(money: Money, sourceAccountId: AccountId): boolean {
    const deposit = new Activity(
      crypto.randomUUID(),
      this.id,
      sourceAccountId,
      this.id,
      new Date(),
      money
    )
    this.addActivity(deposit)
    return true
  }

  private mayWithdraw(money: Money): boolean {
    return this.calculateBalance().amount >= money.amount
  }
}

// Port (interface defined by domain)
export interface LoadAccountPort {
  loadAccount(accountId: AccountId, baselineDate: Date): Promise<Account>
}

export interface UpdateAccountStatePort {
  updateActivities(account: Account): Promise<void>
}

// Use Case (Application Layer)
export interface SendMoneyUseCase {
  execute(command: SendMoneyCommand): Promise<boolean>
}

export class SendMoneyCommand {
  constructor(
    readonly sourceAccountId: AccountId,
    readonly targetAccountId: AccountId,
    readonly money: Money
  ) {}
}

export class SendMoneyService implements SendMoneyUseCase {
  constructor(
    private loadAccountPort: LoadAccountPort,
    private updateAccountStatePort: UpdateAccountStatePort
  ) {}

  async execute(command: SendMoneyCommand): Promise<boolean> {
    const baselineDate = new Date()
    baselineDate.setDate(baselineDate.getDate() - 10)

    const sourceAccount = await this.loadAccountPort.loadAccount(
      command.sourceAccountId,
      baselineDate
    )
    const targetAccount = await this.loadAccountPort.loadAccount(
      command.targetAccountId,
      baselineDate
    )

    const sourceWithdrawal = sourceAccount.withdraw(command.money, command.targetAccountId)
    if (!sourceWithdrawal) return false

    targetAccount.deposit(command.money, command.sourceAccountId)

    await this.updateAccountStatePort.updateActivities(sourceAccount)
    await this.updateAccountStatePort.updateActivities(targetAccount)

    return true
  }
}

// Adapter (Infrastructure Layer)
export class AccountPersistenceAdapter implements LoadAccountPort, UpdateAccountStatePort {
  constructor(private db: any) {}

  async loadAccount(accountId: AccountId, baselineDate: Date): Promise<Account> {
    const accountRow = await this.db('account')
      .where('id', accountId.value)
      .first()

    const activityRows = await this.db('activity')
      .where('owner_account_id', accountId.value)
      .andWhere('timestamp', '>=', baselineDate)

    const account = new Account(
      accountId,
      new Money(accountRow.baseline_balance, accountRow.currency)
    )

    for (const row of activityRows) {
      account.addActivity(new Activity(
        row.id,
        new AccountId(row.owner_account_id),
        new AccountId(row.source_account_id),
        new AccountId(row.target_account_id),
        new Date(row.timestamp),
        new Money(row.amount, row.currency)
      ))
    }

    return account
  }

  async updateActivities(account: Account): Promise<void> {
    // Implementation to persist new activities
  }
}