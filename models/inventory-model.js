const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id  
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ****************************************
*  Model to update inventory item info
* *************************************** */
const updateInventory = async (data) => {
  const sql = `
    UPDATE public.inventory
    SET
      classification_id = $1,
      inv_make = $2,
      inv_model = $3,
      inv_year = $4,
      inv_description = $5,
      inv_image = $6,
      inv_thumbnail = $7,
      inv_price = $8,
      inv_miles = $9,
      inv_color = $10
    WHERE inv_id = $11
  `;

  const values = [
    data.classification_id,
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
    data.inv_id,
  ];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (err) {
    console.error("Error in updateInventory:", err);
    throw err;
  }
};


/* ***************************
 *  Get all deatails on a specific vehicle by inventory id
 * ************************** */
async function getDetailByVehicleId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("Get Details By Vehicle Id error " + error);
  }
}


/* ***************************
 *  Add Classification if not already in system
 * ************************** */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

/* **
 * Add new vehicle
 * **/
async function addNewVehicle(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
    try {
        const sql = "INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id])
    } catch (error) {
        return error.message
    }
}

async function addInventory(data) {
  try {
    const result = await pool.query(
      `INSERT INTO public.inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_price, inv_miles, inv_color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.classification_id,
        data.inv_make,
        data.inv_model,
        data.inv_year,
        data.inv_description,
        data.inv_thumbnail,
        data.inv_image,
        data.inv_price,
        data.inv_miles,
        data.inv_color,
      ]
    );

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error in addInventory:", error);
    return { success: false };
  }
}

module.exports = { updateInventory, getClassifications, getInventoryByClassificationId, getDetailByVehicleId, addClassification, addNewVehicle, addInventory }