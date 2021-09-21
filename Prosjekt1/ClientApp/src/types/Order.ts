export interface Order {
  id: number;
  pizzaType: string;
  pizzaStyle: string;
  quantity: number;
  fullName: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface OrderForm {
  pizzaType: string;
  pizzaStyle: string;
  quantity: string;
  fullName: string;
  address: string;
  email: string;
  phoneNumber: string;
}
