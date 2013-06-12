namespace :db do
  desc "Fill database with sample data"


  task populate: :environment do
    User.create!(name: "Example User",
                 email: "example@vax.com",
                 password: "foobar",
                 password_confirmation: "foobar")
    99.times do |n|
      name  = Faker::Name.name
      email = "example-#{n+1}@vax.com"
      password  = "password"
      User.create!(name: name,
                   email: email,
                   password: password,
                   password_confirmation: password)
    end

    users = User.all
      5.times do
        net_id = Math.floor(100 + (0+100-0)*Math.random())
        sim_size = (Math.random()+1.0) * 10
        stars = Math.floor(0 + (1+3-0)*Math.random()) # random integer between 0 and 3
        refusers = '6,7,8,9,10'
        vax = '1,2,3,4,5'
        users.each {|user| user.scores.create!(net_id: net_id, sim_size: sim_size, refusers: refusers, stars: stars, vax: vax)}
    end
  end
end