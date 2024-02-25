use vecdata::DataFrame;
use wasm_bindgen::prelude::*;
mod vecdata;
use std::any::Any;

// For external functions from JS
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn main() {
    // Your application's initialization logic goes here
    println!("Hello from Rust!"); // Example output
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    // alert(&format!("Hello, {}! Welcome to Rust with Angular.", name));
    return format!("Hello, {}! Welcome to Rust with Angular.", name);
}

#[wasm_bindgen]
pub fn calculate_numbers(x:i8, y:i8, action: &str) -> i8 {
    match action {
        "add" => return adding(x, y),
        "substract" => return substract(x, y),
        "divide" => return divide(x, y),
        "multiply" => return multiply(x, y),
        _ => return 0
    }
}

fn adding(a:i8, b:i8) -> i8 {
    return a + b;
}

fn substract(a:i8, b:i8) -> i8 {
    return a - b;
}

fn divide(a: i8, b: i8) -> i8 {
    return a / b;
}

fn multiply(a: i8, b: i8) -> i8 {
    return a * b;
}

#[wasm_bindgen]
pub fn calculate_bmi(height: f32, weight: f32) -> f32 {
    return weight / ((height / 100.0).powf(2.0));
}

#[wasm_bindgen]
pub fn vector_me(myarr: Vec<dyn Any>) -> Vec<dyn Any> {
    let data = myarr;
    let df = vecdata::DataFrame::new(data);
    // df.print(); // Output: "[1, 2, 3]"
    return df.data;
}