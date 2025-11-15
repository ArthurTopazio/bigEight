// ---- strategy

interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCard implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Pay ${amount}`);
  } 
}

class PayPall implements PaymentStrategy {
  pay(amount:  number) {
    console.log(`Pay ${amount} with paypal`)
  } 
}

class ShoppingCard {
 private paymentStrategy: PaymentStrategy;
 
 constructor(strategy: PaymentStrategy) {
   this.paymentStrategy = strategy;
 }

 checkout(value: number) {
  this.paymentStrategy.pay(value);
 } 
}

const myShoppingCard = new ShoppingCard(new PayPall());

myShoppingCard.checkout(100);

// ---- Subscriber

interface Observer {
  name: string;
  update(state: any): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

class ConcreteSubject implements Subject {
  private observers: Observer[] = [];
  private state: string = 'initial';

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs.name !== observer.name);
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.state);
    }
  }

  // Какой-то метод, который меняет состояние
  setState(newState: any) {
    this.state = newState;
    this.notify();
  }
}

class ConcreteObserver implements Observer {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  update(state: string): void {
    console.log(`${this.name} received update: ${state}`);
  }
}

const subject = new ConcreteSubject();
const observer1 = new ConcreteObserver('Observer 1');
const observer2 = new ConcreteObserver('Observer 2');

subject.attach(observer1);
subject.attach(observer2);

subject.setState('new state');

subject.detach(observer1);

subject.setState('new state 2');

// ---- Decorator
interface Coffee {
  cost(): number;
  description(): string;
}

class Espresso implements Coffee {
  cost(): number {
    return 5;
  }

  description() {
    return 'Espresso';
  }
}

class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  cost() {
   return this.coffee.cost();
  }

  description() {
    return this.coffee.description();
  }
}

class CaramelDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 2;
  }

  description(): string {
    return this.coffee.description() + ", caramel";
  }
}

let coffee = new Espresso();
console.log(coffee.description(), coffee.cost());

coffee = new CaramelDecorator(coffee);

console.log(coffee.description(), coffee.cost());
