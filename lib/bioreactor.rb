class Bioreactor
  @@reactors = []

  def initialize()
    @@reactors << Map.get_random(self)
  end

  def self.data
    ['b'] + @@reactors.map {|it| it.location }
  end
end
