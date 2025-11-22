/* 

OOP - Patterns

*/

// ---- strategy

interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCard implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Pay ${amount} with credit card`);
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
const myShoppingCard2 = new ShoppingCard(new CreditCard());

myShoppingCard.checkout(100);
myShoppingCard2.checkout(100);
// ================================================================

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

  // some method that changes the state
  setState(newState: string) {
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

// ================================================================

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

// ================================================================

// ---- Factory Method
interface PaymentProcessor {
  process(amount: number): void;
}

class CryptoProcessor implements PaymentProcessor {
  process(amount: number) {
    console.log(`Processing crypto payment: ${amount}`);
  }
}

class BankWireProcessor implements PaymentProcessor {
  process(amount: number) {
    console.log(`Processing bank wire: ${amount}`);
  }
}

abstract class PaymentFactory {
  abstract createProcessor(): PaymentProcessor;

  pay(amount: number) {
    const processor = this.createProcessor();
    processor.process(amount);
  }
}

class CryptoFactory extends PaymentFactory {
  createProcessor() {
    return new CryptoProcessor();
  }
}

class BankWireFactory extends PaymentFactory {
  createProcessor() {
    return new BankWireProcessor();
  }
}

new CryptoFactory().pay(1000);
new BankWireFactory().pay(5000);

// ================================================================

// ---- Abstract Factory

interface Button {
  render(): void;
}

interface Input {
  render(): void;
}

class DarkButton implements Button {
  render() { console.log("Dark button"); }
}
class DarkInput implements Input {
  render() { console.log("Dark input"); }
}

class LightButton implements Button {
  render() { console.log("Light button"); }
}
class LightInput implements Input {
  render() { console.log("Light input"); }
}

interface UIFactory {
  createButton(): Button;
  createInput(): Input;
}

class DarkUIFactory implements UIFactory {
  createButton() { return new DarkButton(); }
  createInput() { return new DarkInput(); }
}

class LightUIFactory implements UIFactory {
  createButton() { return new LightButton(); }
  createInput() { return new LightInput(); }
}

function renderUI(factory: UIFactory) {
  factory.createButton().render();
  factory.createInput().render();
}

renderUI(new DarkUIFactory());
renderUI(new LightUIFactory());

// ================================================================

// ---- Singleton

class Config {
  private static instance: Config;
  private constructor(
    public readonly baseUrl: string,
  ) {}

  static getInstance() {
    if (!Config.instance) {
      Config.instance = new Config("https://api.example.com");
    }
    return Config.instance;
  }
}

const config = Config.getInstance();
console.log(config.baseUrl);
const config2 = Config.getInstance();
console.log(config2.baseUrl);

console.log(config === config2);

// ================================================================

// ---- Command

interface Command {
  execute(): void;
}

class BuyOrder implements Command {
  constructor(private symbol: string, private qty: number) {}
  execute() {
    console.log(`Buying ${this.qty} of ${this.symbol}`);
  }
}

class SellOrder implements Command {
  constructor(private symbol: string, private qty: number) {}
  execute() {
    console.log(`Selling ${this.qty} of ${this.symbol}`);
  }
}

class Trader {
  queue: Command[] = [];

  add(command: Command) {
    this.queue.push(command);
  }

  run() {
    this.queue.forEach(cmd => cmd.execute());
    this.queue = [];
  }
}

const trader = new Trader();
trader.add(new BuyOrder("BTCUSDT", 1));
trader.add(new SellOrder("ETHUSDT", 3));
trader.run();

// ================================================================

// ---- Adapter
interface PriceFeed {
  getPrice(symbol: string): Promise<number>;
}

class BinanceAPI {
  fetchTicker(symbol: string) { return Promise.resolve({ price: 100 }); }
}

class BinanceAdapter implements PriceFeed {
  constructor(private api: BinanceAPI) {}
  async getPrice(symbol: string) {
    const res = await this.api.fetchTicker(symbol);
    return res.price;
  }
}

const feed: PriceFeed = new BinanceAdapter(new BinanceAPI());
feed.getPrice("BTCUSDT").then(console.log);

// ================================================================

// ---- Facade

class FireblocksService {
  send(amount: number) { return Promise.resolve({ tx: "123" }); }
}

class AmlChecker {
  verify(tx: string) { return Promise.resolve(); }
}

class LedgerService {
  updateBalance(userId: string, amount: number) { return Promise.resolve(); }
}

class DepositFacade {
  constructor(
    private fireblocks: FireblocksService,
    private aml: AmlChecker,
    private ledger: LedgerService,
  ) {}

  async deposit(amount: number, userId: string) {
    const tx = await this.fireblocks.send(amount);
    await this.aml.verify(tx.tx);
    await this.ledger.updateBalance(userId, amount);
    return tx;
  }
}

// ================================================================

// ---- Template Method
abstract class VerificationProcess {
  verify() {
    this.checkKyc();
    this.checkAml();
    this.finalStep();
  }

  abstract checkKyc(): void;
  abstract checkAml(): void;
  abstract finalStep(): void;
}

class SimpleVerification extends VerificationProcess {
  checkKyc() { console.log("Simple KYC"); }
  checkAml() { console.log("Simple AML"); }
  finalStep() { console.log("Approve simple user"); }
}


// ================================================================

// ---- Iterator

class OrderBook implements Iterable<number> {
  constructor(private orders: number[]) {}

  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => ({
        value: this.orders[i++],
        done: i > this.orders.length,
      })
    }
  }
}

for (const order of new OrderBook([1,2,3])) {
  console.log(order);
}

// ================================================================

// ---- State

interface OrderState {
  next(order: Order): void;
}

class Pending implements OrderState {
  next(order: Order) {
    console.log("Order filled");
    order.state = new Filled();
  }
}
class Filled implements OrderState {
  next(order: Order) {
    console.log("No more transitions");
  }
}

class Order {
  state: OrderState = new Pending();
  next() { this.state.next(this); }
}

const o = new Order();
o.next(); // filled
o.next(); // no transitions

// ================================================================

// ---- Composite
interface Node {
  render(): void;
}

class Item implements Node {
  constructor(private name: string) {}
  render() { console.log(this.name); }
}

class Group implements Node {
  private children: Node[] = [];

  add(child: Node) { this.children.push(child); }
  render() {
    this.children.forEach(c => c.render());
  }
}

const menu = new Group();
const dashboard = new Item("Dashboard");
const reports = new Item("Reports");
menu.add(dashboard);
menu.add(reports);
menu.render();

// ================================================================

// ---- Proxy

class PriceService {
  getPrice(symbol: string) {
    console.log("Fetching real price...");
    return Promise.resolve(100);
  }
}

class PriceProxy {
  cache = new Map<string, number>();
  constructor(private svc: PriceService) {}

  async getPrice(symbol: string) {
    if (this.cache.has(symbol)) return this.cache.get(symbol)!;
    const price = await this.svc.getPrice(symbol);
    this.cache.set(symbol, price);
    return price;
  }
}

// ================================================================

// ---- Flyweight

class SymbolFlyweight {
  constructor(public symbol: string) {}
}

class SymbolFactory {
  private static pool = new Map<string, SymbolFlyweight>();

  static get(symbol: string) {
    if (!this.pool.has(symbol)) {
      this.pool.set(symbol, new SymbolFlyweight(symbol));
    }
    return this.pool.get(symbol)!;
  }
}

const s1 = SymbolFactory.get("BTC");
const s2 = SymbolFactory.get("BTC");
console.log(s1 === s2); // true


