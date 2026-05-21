// Rust Ownership and Error Handling Best Practices

use std::fs::File;
use std::io::{self, Read, Write};
use std::path::Path;

// ✅ Good: Custom error type with thiserror
#[derive(Debug)]
pub enum AppError {
    Io(io::Error),
    Parse(String),
    NotFound { resource: String, id: String },
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "IO error: {}", e),
            AppError::Parse(msg) => write!(f, "Parse error: {}", msg),
            AppError::NotFound { resource, id } => {
                write!(f, "{} not found: {}", resource, id)
            }
        }
    }
}

impl std::error::Error for AppError {}

impl From<io::Error> for AppError {
    fn from(err: io::Error) -> Self {
        AppError::Io(err)
    }
}

// ✅ Good: Using ? operator for error propagation
pub fn read_config(path: &str) -> Result<String, AppError> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

// ✅ Good: Newtype pattern for type safety
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct UserId(u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct OrderId(u64);

pub struct User {
    id: UserId,
    name: String,
}

pub fn find_user(id: UserId) -> Option<User> {
    // Only accepts UserId, not OrderId!
    Some(User {
        id,
        name: "Alice".to_string(),
    })
}

// ✅ Good: Iterator chains instead of loops
pub fn sum_even_numbers(numbers: &[i32]) -> i32 {
    numbers
        .iter()
        .filter(|&&n| n % 2 == 0)
        .sum()
}

// ✅ Good: Using references to avoid cloning
pub fn process_users(users: &[User]) -> Vec<String> {
    users
        .iter()
        .map(|u| u.name.clone()) // Clone only when necessary
        .collect()
}

// ✅ Good: RAII with Drop trait
pub struct TempFile {
    path: String,
}

impl TempFile {
    pub fn new(path: &str) -> io::Result<Self> {
        File::create(path)?;
        Ok(TempFile {
            path: path.to_string(),
        })
    }
}

impl Drop for TempFile {
    fn drop(&mut self) {
        let _ = std::fs::remove_file(&self.path);
    }
}

// ❌ Bad: Unnecessary clone
fn bad_clone_example() {
    let name = String::from("Alice");
    let _name2 = name.clone(); // ❌ Only clone if both need ownership
    println!("{}", name);
}

// ❌ Bad: unwrap in production code
fn bad_unwrap_example() {
    let file = File::open("config.txt").unwrap(); // ❌ Use ? or match
    // ...
}

// ❌ Bad: Ignoring Result
fn bad_ignore_example() {
    let _ = File::open("config.txt"); // ❌ Handle the error!
}