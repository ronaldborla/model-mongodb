/**
 * After delete
 */
export interface AfterDelete {
  afterDelete(): Promise<this>;
}

/**
 * After insert
 */
export interface AfterInsert {
  afterInsert(): Promise<this>;
}

/**
 * After reload
 */
export interface AfterReload {
  afterReload(): Promise<this>;
}

/**
 * After save
 */
export interface AfterSave {
  afterSave(): Promise<this>;
}

/**
 * After update
 */
export interface AfterUpdate {
  afterUpdate(): Promise<this>;
}

/**
 * After validate
 */
export interface AfterValidate {
  afterValidate(): Promise<this>;
}

/**
 * Before delete
 */
export interface BeforeDelete {
  beforeDelete(): Promise<this>;
}

/**
 * Before insert
 */
export interface BeforeInsert {
  beforeInsert(): Promise<this>;
}

/**
 * Before reload
 */
export interface BeforeReload {
  beforeReload(): Promise<this>;
}

/**
 * Before save
 */
export interface BeforeSave {
  beforeSave(): Promise<this>;
}

/**
 * Before update
 */
export interface BeforeUpdate {
  beforeUpdate(): Promise<this>;
}

/**
 * Before validate
 */
export interface BeforeValidate {
  beforeValidate(): Promise<this>;
}
