class Bioreactor
  @@reactors = []

  def initialize()
    @@reactors << Map.get_bioreactor(self)
  end

  def self.data
    ['b'] << @@reactors.map {|it| it.first.location }
  end
end
