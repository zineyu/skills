// Rust implementation of Hexagonal Architecture (Ports and Adapters)

use std::collections::HashMap;
use std::fmt;
use std::sync::{Arc, Mutex};

// Domain Layer

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct UserId(String);

impl UserId {
    pub fn new(id: impl Into<String>) -> Self {
        UserId(id.into())
    }
}

#[derive(Debug, Clone)]
pub struct Email(String);

impl Email {
    pub fn new(email: impl Into<String>) -> Result<Self, String> {
        let email = email.into();
        if email.contains('@') {
            Ok(Email(email))
        } else {
            Err("Invalid email format".to_string())
        }
    }
}

#[derive(Debug, Clone)]
pub struct User {
    id: UserId,
    name: String,
    email: Email,
}

impl User {
    pub fn new(id: UserId, name: String, email: Email) -> Self {
        User { id, name, email }
    }

    pub fn update_email(&mut self, email: Email) {
        self.email = email;
    }

    pub fn id(&self) -> &UserId {
        &self.id
    }

    pub fn name(&self) -> &str {
        &self.name
    }
}

// Domain Events
#[derive(Debug, Clone)]
pub struct UserCreated {
    pub user_id: UserId,
    pub name: String,
}

#[derive(Debug, Clone)]
pub struct UserEmailUpdated {
    pub user_id: UserId,
    pub new_email: Email,
}

// Port (trait defined by domain)
pub trait UserRepository: Send + Sync {
    fn find_by_id(&self, id: &UserId) -> Result<Option<User>, String>;
    fn save(&self, user: &User) -> Result<(), String>;
    fn delete(&self, id: &UserId) -> Result<(), String>;
}

pub trait EventPublisher: Send + Sync {
    fn publish(&self, event: Box<dyn DomainEvent>) -> Result<(), String>;
}

pub trait DomainEvent: fmt::Debug + Send {
    fn event_type(&self) -> &'static str;
}

impl DomainEvent for UserCreated {
    fn event_type(&self) -> &'static str {
        "UserCreated"
    }
}

impl DomainEvent for UserEmailUpdated {
    fn event_type(&self) -> &'static str {
        "UserEmailUpdated"
    }
}

// Application Layer (Use Case)

pub struct RegisterUserCommand {
    pub id: String,
    pub name: String,
    pub email: String,
}

pub struct UpdateUserEmailCommand {
    pub user_id: String,
    pub new_email: String,
}

pub struct UserService {
    user_repo: Arc<dyn UserRepository>,
    event_pub: Arc<dyn EventPublisher>,
}

impl UserService {
    pub fn new(
        user_repo: Arc<dyn UserRepository>,
        event_pub: Arc<dyn EventPublisher>,
    ) -> Self {
        UserService {
            user_repo,
            event_pub,
        }
    }

    pub fn register_user(&self, cmd: RegisterUserCommand) -> Result<User, String> {
        let email = Email::new(cmd.email)?;
        let user = User::new(UserId::new(cmd.id), cmd.name, email);

        self.user_repo.save(&user)?;

        let event = UserCreated {
            user_id: user.id().clone(),
            name: user.name().to_string(),
        };
        self.event_pub.publish(Box::new(event))?;

        Ok(user)
    }

    pub fn update_email(&self, cmd: UpdateUserEmailCommand) -> Result<(), String> {
        let user_id = UserId::new(cmd.user_id);
        let new_email = Email::new(cmd.new_email)?;

        let mut user = self
            .user_repo
            .find_by_id(&user_id)?
            .ok_or_else(|| "User not found".to_string())?;

        user.update_email(new_email.clone());
        self.user_repo.save(&user)?;

        let event = UserEmailUpdated {
            user_id,
            new_email,
        };
        self.event_pub.publish(Box::new(event))?;

        Ok(())
    }
}

// Infrastructure Layer - Adapters

pub struct InMemoryUserRepository {
    users: Mutex<HashMap<UserId, User>>,
}

impl InMemoryUserRepository {
    pub fn new() -> Self {
        InMemoryUserRepository {
            users: Mutex::new(HashMap::new()),
        }
    }
}

impl UserRepository for InMemoryUserRepository {
    fn find_by_id(&self, id: &UserId) -> Result<Option<User>, String> {
        let users = self.users.lock().map_err(|e| e.to_string())?;
        Ok(users.get(id).cloned())
    }

    fn save(&self, user: &User) -> Result<(), String> {
        let mut users = self.users.lock().map_err(|e| e.to_string())?;
        users.insert(user.id().clone(), user.clone());
        Ok(())
    }

    fn delete(&self, id: &UserId) -> Result<(), String> {
        let mut users = self.users.lock().map_err(|e| e.to_string())?;
        users.remove(id);
        Ok(())
    }
}

pub struct ConsoleEventPublisher;

impl EventPublisher for ConsoleEventPublisher {
    fn publish(&self, event: Box<dyn DomainEvent>) -> Result<(), String> {
        println!("Event published: {:?}", event);
        Ok(())
    }
}

// Example usage
fn main() {
    let user_repo: Arc<dyn UserRepository> = Arc::new(InMemoryUserRepository::new());
    let event_pub: Arc<dyn EventPublisher> = Arc::new(ConsoleEventPublisher);

    let service = UserService::new(user_repo, event_pub);

    // Register user
    let user = service.register_user(RegisterUserCommand {
        id: "user-1".to_string(),
        name: "Alice".to_string(),
        email: "alice@example.com".to_string(),
    });

    match user {
        Ok(u) => println!("User registered: {:?}", u),
        Err(e) => println!("Error: {}", e),
    }

    // Update email
    let result = service.update_email(UpdateUserEmailCommand {
        user_id: "user-1".to_string(),
        new_email: "alice.new@example.com".to_string(),
    });

    match result {
        Ok(_) => println!("Email updated successfully"),
        Err(e) => println!("Error: {}", e),
    }
}