require 'bundler'
Bundler.require :benchmark

$:.unshift './../lib'
require 'cell'
require 'map'
require 'bioreactor'
require 'wall'
require 'worm'
require 'human'
require 'benchmark'

def json(command, data)
  JSON.generate [command, data]
end

Benchmark.bmbm do |x|
  x.report('Worm.new') do
    1000.times do
      json('id', Object.new.object_id)
      Worm.new Object.new
    end
  end

  x.report('Worm.find+direction') do
    Map.width.times do |x|
      Map.height.times do |y|
        Map.cell(x,y).content = nil
      end
    end

    100.times do
      socket = Object.new
      Worm.new socket
      Worm.find(socket).direction = '1'.to_i
    end
  end

  x.report('Periodic Timer') do
    10.times do
      Worm.all.each &:move
      json = JSON.generate ['render', Map.data]
      Worm.sockets.map do
        json
      end
    end
  end

  x.report('Worm.destroy') do
    1000.times do
      Worm.destroy Worm.storage.first.first
    end
  end

  x.report('Periodic Timer smaller') do
    10.times do
      Worm.all.each &:move
      json = JSON.generate ['render', Map.data]
      Worm.sockets.map do
        json
      end
    end
  end

end
