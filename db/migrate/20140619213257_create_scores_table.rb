class CreateScoresTable < ActiveRecord::Migration
  def change
    create_table :scores do |t|
      t.string :player_name, null: false
      t.integer :score, null: false
      t.timestamps
    end
  end
end
