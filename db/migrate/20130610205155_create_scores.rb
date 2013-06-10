class CreateScores < ActiveRecord::Migration
  def change
    create_table :scores do |t|
      t.integer :user_id
      t.integer :net_id
      t.text :refusers
      t.text :vax
      t.integer :stars
      t.float :sim_size

      t.timestamps
    end
  end
end
