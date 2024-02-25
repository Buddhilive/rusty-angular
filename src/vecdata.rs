pub struct DataFrame<T> {
    pub data: Vec<T>,
}

impl<T> DataFrame<T> {
    pub fn new(data: Vec<T>) -> Self {
        Self { data }
    }
}
