/**
 * After delete
 */
export interface AfterDelete {
  afterDelete(): Promise<this>;
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
 * Before validate
 */
export interface BeforeValidate {
  beforeValidate(): Promise<this>;
}
