import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
  let eventEmitter: EventEmitter<string>;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  it('should register and emit an event', () => {
    const cb = jest.fn();
    eventEmitter.on('testEvent', cb);
    eventEmitter.emit('testEvent', 42);
    expect(cb).toHaveBeenCalledWith(42);
  });

  it('should unregister an event listener', () => {
    const cb = jest.fn();
    eventEmitter.on('testEvent', cb);
    eventEmitter.off('testEvent', cb);
    eventEmitter.emit('testEvent', 42);
    expect(cb).not.toHaveBeenCalled();
  });

  it('should unregister all event listeners for a specific event', () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    eventEmitter.on('testEvent', cb1);
    eventEmitter.on('testEvent', cb2);
    eventEmitter.off('testEvent');
    eventEmitter.emit('testEvent', 42);
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).not.toHaveBeenCalled();
  });

  it('should unregister all event listeners for all events', () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    eventEmitter.on('testEvent1', cb1);
    eventEmitter.on('testEvent2', cb2);
    eventEmitter.off();
    eventEmitter.emit('testEvent1', 42);
    eventEmitter.emit('testEvent2', 42);
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).not.toHaveBeenCalled();
  });

  it('should register a one-time event listener', () => {
    const cb = jest.fn();
    eventEmitter.once('testEvent', cb);
    eventEmitter.emit('testEvent', 42);
    eventEmitter.emit('testEvent', 43);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(42);
  });

  // Добавьте другие тесты по необходимости
});