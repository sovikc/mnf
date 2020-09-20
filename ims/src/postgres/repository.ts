import { makeAddress, makeAsset, makeLocation, makeShoppingCentre } from '../inventory/maker';
import { Errors } from '../inventory/errors';

export function makeRepository(pool: any) {
  const storeCentre = async (centre: any, userID: string) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
      const insertCentreStmt = `INSERT INTO shopping_centre(shopping_centre_uuid, shopping_centre_name, address_line_one, address_line_two, city, state_name, postcode, country, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING shopping_centre_id`;
      const res = await client.query(insertCentreStmt, [
        centre.id,
        centre.name,
        centre.address.lineOne,
        centre.address.lineTwo,
        centre.address.city,
        centre.address.state,
        centre.address.postCode,
        centre.address.country,
        userID,
      ]);
      const insertLogStmt = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_char_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmt, [
        res.rows[0].shopping_centre_id,
        'shopping_centre',
        'create',
        'shopping_centre_name',
        typeof centre.name,
        centre.name,
        userID,
      ]);
      await client.query(insertLogStmt, [
        res.rows[0].shopping_centre_id,
        'shopping_centre',
        'create',
        'address_line_one',
        typeof centre.address.lineOne,
        centre.address.lineOne,
        userID,
      ]);
      if (centre.address.lineTwo) {
        await client.query(insertLogStmt, [
          res.rows[0].shopping_centre_id,
          'shopping_centre',
          'create',
          'address_line_two',
          typeof centre.address.lineTwo,
          centre.address.lineTwo,
          userID,
        ]);
      }
      await client.query(insertLogStmt, [
        res.rows[0].shopping_centre_id,
        'shopping_centre',
        'create',
        'city',
        typeof centre.address.city,
        centre.address.city,
        userID,
      ]);
      await client.query(insertLogStmt, [
        res.rows[0].shopping_centre_id,
        'shopping_centre',
        'create',
        'state_name',
        typeof centre.address.state,
        centre.address.state,
        userID,
      ]);
      await client.query(insertLogStmt, [
        res.rows[0].shopping_centre_id,
        'shopping_centre',
        'create',
        'postcode',
        typeof centre.address.postcode,
        centre.address.postCode,
        userID,
      ]);
      await client.query(insertLogStmt, [
        res.rows[0].shopping_centre_id,
        'shopping_centre',
        'create',
        'country',
        typeof centre.address.country,
        centre.address.country,
        userID,
      ]);
      await client.query('COMMIT');
      return centre.id;
    } catch (err) {
      await client.query('ROLLBACK');
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const findCentreMatch = async (centre: any) => {
    const client = await pool.connect();
    const centres: any[] = [];

    const selectCentreStmt = `SELECT * from shopping_centre where shopping_centre_name = $1 and address_line_one = $2 and city = $3 and state_name = $4 and postcode = $5 and country = $6`.concat(
      ((address): string => {
        if (address.lineTwo) {
          return ' and address_line_two = $7';
        }
        return ' and address_line_two IS NULL';
      })(centre.address),
    );
    const values = [
      centre.name,
      centre.address.lineOne,
      centre.address.city,
      centre.address.state,
      centre.address.postCode,
      centre.address.country,
    ];
    if (centre.address.lineTwo) values.push(centre.address.lineTwo);
    try {
      const res = await client.query(selectCentreStmt, values);
      const { rows } = res;
      rows.forEach((row: any) => {
        const address = makeAddress(
          row.address_line_one,
          row.city,
          row.state_name,
          row.postcode,
          row.country,
          row.address_line_two,
        );
        if (address instanceof Error) {
          throw address;
        }
        const centreObject = makeShoppingCentre(row.shopping_centre_name, address, row.shopping_centre_uuid);
        centres.push(centreObject);
      });
      return centres;
    } catch (e) {
      const err = e;
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const findCentreByID = async (centreID: string) => {
    const client = await pool.connect();
    let centre: any = null;

    const selectCentreStmt = `SELECT * from shopping_centre where shopping_centre_uuid = $1 and deactivated = $2`;
    const values = [centreID, false];

    try {
      const res = await client.query(selectCentreStmt, values);
      const { rows } = res;
      const row = rows[0];
      if (!row) {
        return centre;
      }

      const address = makeAddress(
        row.address_line_one,
        row.city,
        row.state_name,
        row.postcode,
        row.country,
        row.address_line_two,
      );
      if (address instanceof Error) {
        throw address;
      }
      centre = makeShoppingCentre(row.shopping_centre_name, address, row.shopping_centre_uuid);
      return centre;
    } catch (e) {
      const err = e;
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const findLocationMatch = async (code: string, centreID: string) => {
    const client = await pool.connect();
    let location: any = null;

    const selectLocationStmt = `SELECT * from location_within_centre where location_code = $1 and shopping_centre_uuid = $2 and deactivated = $3`;
    const values = [code, centreID, false];

    try {
      const res = await client.query(selectLocationStmt, values);
      const { rows } = res;
      const row = rows[0];
      if (!row) {
        return location;
      }
      location = makeLocation(row.location_code, row.location_uuid);
      return location;
    } catch (e) {
      const err = e;
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const storeLocation = async (location: any, centreID: string, userID: string) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
      const insertLocationStmt = `INSERT INTO location_within_centre(location_uuid, location_code, shopping_centre_uuid, created_by)
      VALUES($1, $2, $3, $4) RETURNING location_id`;
      const res = await client.query(insertLocationStmt, [location.id, location.code, centreID, userID]);
      const insertLogStmt = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_char_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmt, [
        res.rows[0].location_id,
        'location_within_centre',
        'create',
        'location_code',
        typeof location.code,
        location.code,
        userID,
      ]);
      await client.query(insertLogStmt, [
        res.rows[0].location_id,
        'location_within_centre',
        'create',
        'shopping_centre_uuid',
        typeof centreID,
        centreID,
        userID,
      ]);
      await client.query('COMMIT');
      return location.id;
    } catch (err) {
      await client.query('ROLLBACK');
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const findAssetMatch = async (name: string) => {
    const client = await pool.connect();
    let asset: any = null;

    const selectAssetStmt = `SELECT * from asset where asset_name = $1 and deactivated = $2`;
    const values = [name, false];

    try {
      const res = await client.query(selectAssetStmt, values);
      const { rows } = res;
      const row = rows[0];
      if (!row) {
        return asset;
      }
      asset = makeAsset(
        row.asset_name,
        row.asset_length,
        row.asset_breadth,
        row.asset_depth,
        row.asset_active,
        row.asset_uuid,
      );
      return asset;
    } catch (e) {
      const err = e;
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const findAssetByID = async (assetID: string) => {
    const client = await pool.connect();
    let asset: any = null;

    const selectAssetStmt = `SELECT * from asset where asset_uuid = $1 and deactivated = $2`;
    const values = [assetID, false];
    try {
      const res = await client.query(selectAssetStmt, values);
      const { rows } = res;
      const row = rows[0];
      if (!row) {
        return asset;
      }
      asset = makeAsset(
        row.asset_name,
        row.asset_length,
        row.asset_breadth,
        row.asset_depth,
        row.asset_active,
        row.asset_uuid,
      );
      return asset;
    } catch (e) {
      const err = e;
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const storeAsset = async (asset: any, userID: string) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
      const insertAssetStmt = `INSERT INTO asset(asset_uuid, asset_name, asset_active, asset_length, asset_breadth, asset_depth, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING asset_id`;
      const res = await client.query(insertAssetStmt, [
        asset.id,
        asset.name,
        asset.active,
        asset.length,
        asset.breadth,
        asset.depth,
        userID,
      ]);
      const insertLogStmtChar = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_char_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmtChar, [
        res.rows[0].asset_id,
        'asset',
        'create',
        'asset_name',
        typeof asset.name,
        asset.name,
        userID,
      ]);
      const insertLogStmtBool = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_bool_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmtBool, [
        res.rows[0].asset_id,
        'asset',
        'create',
        'asset_active',
        typeof asset.active,
        asset.active,
        userID,
      ]);
      const insertLogStmtNum = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_numeric_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmtNum, [
        res.rows[0].asset_id,
        'asset',
        'create',
        'asset_length',
        typeof asset.length,
        asset.length,
        userID,
      ]);
      await client.query(insertLogStmtNum, [
        res.rows[0].asset_id,
        'asset',
        'create',
        'asset_breadth',
        typeof asset.breadth,
        asset.breadth,
        userID,
      ]);
      await client.query(insertLogStmtNum, [
        res.rows[0].asset_id,
        'asset',
        'create',
        'asset_depth',
        typeof asset.depth,
        asset.depth,
        userID,
      ]);
      await client.query('COMMIT');
      return asset.id;
    } catch (err) {
      await client.query('ROLLBACK');
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const updateAsset = async (asset: any, userID: string) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
      const updateAssetStmt = `UPDATE asset SET asset_name = $1, asset_active = $2, asset_length = $3, asset_breadth = $4, asset_depth = $5 WHERE asset_uuid = $6 RETURNING asset_id`;
      const res = await client.query(updateAssetStmt, [
        asset.name,
        asset.active,
        asset.length,
        asset.breadth,
        asset.depth,
        asset.id,
      ]);
      const insertLogStmtChar = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_char_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmtChar, [
        res.rows[0].asset_id,
        'asset',
        'update',
        'asset_name',
        typeof asset.name,
        asset.name,
        userID,
      ]);
      const insertLogStmtBool = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_bool_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmtBool, [
        res.rows[0].asset_id,
        'asset',
        'update',
        'asset_active',
        typeof asset.active,
        asset.active,
        userID,
      ]);
      const insertLogStmtNum = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_numeric_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmtNum, [
        res.rows[0].asset_id,
        'asset',
        'update',
        'asset_length',
        typeof asset.length,
        asset.length,
        userID,
      ]);
      await client.query(insertLogStmtNum, [
        res.rows[0].asset_id,
        'asset',
        'update',
        'asset_breadth',
        typeof asset.breadth,
        asset.breadth,
        userID,
      ]);
      await client.query(insertLogStmtNum, [
        res.rows[0].asset_id,
        'asset',
        'update',
        'asset_depth',
        typeof asset.depth,
        asset.depth,
        userID,
      ]);
      await client.query('COMMIT');
      const assetNumericID = res.rows[0].asset_id;
      return assetNumericID;
    } catch (err) {
      await client.query('ROLLBACK');
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const findAllocationByLocation = async (centreID: string, locationID: string) => {
    const client = await pool.connect();
    let allocation: any = null;

    const selectAllocationStmt = `SELECT * from asset_allocation where shopping_centre_uuid = $1 and location_uuid = $2`;
    const values = [centreID, locationID];

    try {
      const res = await client.query(selectAllocationStmt, values);
      const { rows } = res;
      const row = rows[0];
      if (!row) {
        return allocation;
      }
      allocation = {};
      allocation.centreID = row.shopping_centre_uuid;
      allocation.locationID = row.location_uuid;
      allocation.assetID = row.asset_uuid;
      return allocation;
    } catch (e) {
      const err = e;
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const findAssetAllocation = async (assetID: string) => {
    const client = await pool.connect();
    let allocation: any = null;

    const selectAllocationStmt = `SELECT * from asset_allocation where asset_uuid = $1`;
    const values = [assetID];

    try {
      const res = await client.query(selectAllocationStmt, values);
      const { rows } = res;
      const row = rows[0];
      if (!row) {
        return allocation;
      }
      allocation = {};
      allocation.centreID = row.shopping_centre_uuid;
      allocation.locationID = row.location_uuid;
      allocation.assetID = row.asset_uuid;
      return allocation;
    } catch (e) {
      const err = e;
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const storeAllocation = async (centreID: string, locationID: any, assetID: any, userID: string) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
      const insertAllocationStmt = `INSERT INTO asset_allocation(shopping_centre_uuid, location_uuid, asset_uuid, created_by)
      VALUES($1, $2, $3, $4) RETURNING allocation_id`;
      const res = await client.query(insertAllocationStmt, [centreID, locationID, assetID, userID]);
      const allocationID = res.rows[0].allocation_id;
      const insertLogStmt = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_char_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmt, [
        res.rows[0].allocation_id,
        'asset_allocation',
        'create',
        'shopping_centre_uuid',
        typeof centreID,
        centreID,
        userID,
      ]);
      await client.query(insertLogStmt, [
        res.rows[0].allocation_id,
        'asset_allocation',
        'create',
        'location_uuid',
        typeof locationID,
        locationID,
        userID,
      ]);
      await client.query(insertLogStmt, [
        res.rows[0].allocation_id,
        'asset_allocation',
        'create',
        'asset_uuid',
        typeof assetID,
        assetID,
        userID,
      ]);
      await client.query('COMMIT');
      return allocationID;
    } catch (err) {
      await client.query('ROLLBACK');
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  const removeAllocation = async (centreID: string, locationID: string, assetID: any, userID: string) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
      const insertAllocationStmt = `DELETE FROM asset_allocation where shopping_centre_uuid = $1 and location_uuid = $2 and asset_uuid = $3 RETURNING allocation_id`;
      const res = await client.query(insertAllocationStmt, [centreID, locationID, assetID]);
      const allocationID = res.rows[0].allocation_id;
      const insertLogStmt = `INSERT INTO change_log(entity_id, entity_type, operation_type, field_name, field_value_type, field_char_value, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(insertLogStmt, [
        res.rows[0].allocation_id,
        'asset_allocation',
        'delete',
        'asset_uuid',
        typeof assetID,
        assetID,
        userID,
      ]);
      await client.query('COMMIT');
      return allocationID;
    } catch (err) {
      await client.query('ROLLBACK');
      err.name = Errors.RuntimeError;
      throw err;
    } finally {
      client.release();
    }
  };

  return {
    findCentreByID,
    findCentreMatch,
    storeCentre,
    findLocationMatch,
    storeLocation,
    findAssetMatch,
    findAssetByID,
    storeAsset,
    updateAsset,
    findAllocationByLocation,
    findAssetAllocation,
    storeAllocation,
    removeAllocation,
  };
}
