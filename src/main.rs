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
pub fn calculate_numbers(x:i8, y:i8, action: &str) -> i8 {
    match action {
        "add" => return adding(x, y),
        "substract" => return substract(x, y),
        _ => return 0
    }
}

fn adding(a:i8, b:i8) -> i8 {
    return a + b;
}

fn substract(a:i8, b:i8) -> i8 {
    return a - b;
}