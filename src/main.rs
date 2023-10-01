use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    // alert(&format!("Hello, {}! Welcome to Rust with Angular.", name));
    return format!("Hello, {}! Welcome to Rust with Angular.", name);
}

#[wasm_bindgen]
pub fn add_numbers(x: i8, y: i8) -> i8 {
    return adding(x, y);
}

fn adding(a: i8, b:i8) -> i8 {
    return a + b;
}