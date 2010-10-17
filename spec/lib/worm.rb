$:.unshift './../../lib'
require_relative '../spec_runner'

describe Worm do
  it 'should initialize worm without error' do
    lambda { Worm.new Object.new; raise NotImplementedError }.must_raise NotImplementedError
  end

  it 'should delete worm without error' do
    socket = Object.new
    Worm.new socket
    lambda { Worm.destroy socket; raise NotImplementedError }.must_raise NotImplementedError
  end

  it 'should find worm without error' do
    socket = Object.new
    Worm.new socket
    lambda { Worm.find socket; raise NotImplementedError }.must_raise NotImplementedError
  end

  it 'should find worm and set direction without error' do
    socket = Object.new
    Worm.new socket
    lambda { Worm.find(socket).direction = 1; raise NotImplementedError }.must_raise NotImplementedError
  end

  it 'should use correct format' do
    socket = Object.new
    Worm.new socket
    Human.new
    Human.new
    p Map.data
  end

end