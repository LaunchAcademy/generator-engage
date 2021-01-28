/* eslint-disable no-console */
import { connection } from "../boot.js"

class Seeder {
  static async seed() {
    // include individual seed commands here

    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder