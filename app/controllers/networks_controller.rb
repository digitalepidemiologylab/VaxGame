class NetworksController < ApplicationController

    networks = Network.limit(10)


end
