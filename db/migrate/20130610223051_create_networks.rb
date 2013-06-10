class CreateNetworks < ActiveRecord::Migration
  def change
    create_table :networks do |t|
      t.integer :net_id
      t.text :description

      t.timestamps
    end
  end
end
