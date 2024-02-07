export function ILike(field: string, value: string): string {
  return `LOWER(${field}) = LOWER("${value}")`;
}

// Equal function for equality comparison
export function Equal(field: string, value: any): string {
  return `${field} = "${value}"`;
}

// NotEqual function for not equal comparison
export function NotEqual(field: string, value: any): string {
  return `${field} != "${value}"`;
}

// In function for checking inclusion in a list
export function In(field: string, values: any[]): string {
  const valueList = values.map((val) => `"${val}"`).join(', ');
  return `${field} IN [${valueList}]`;
}

// NotIn function for checking exclusion from a list
export function NotIn(field: string, values: any[]): string {
  const valueList = values.map((val) => `"${val}"`).join(', ');
  return `${field} NOT IN [${valueList}]`;
}

// GreaterThan function for greater than comparison
export function GreaterThan(field: string, value: any): string {
  return `${field} > "${value}"`;
}

// LessThan function for less than comparison
export function LessThan(field: string, value: any): string {
  return `${field} < "${value}"`;
}

// GreaterThanOrEqual function for greater than or equal comparison
export function GreaterThanOrEqual(field: string, value: any): string {
  return `${field} >= "${value}"`;
}

// LessThanOrEqual function for less than or equal comparison
export function LessThanOrEqual(field: string, value: any): string {
  return `${field} <= "${value}"`;
}

// StartsWith function for checking if a field starts with a certain value
export function StartsWith(field: string, value: string): string {
  return `STARTS_WITH(${field}, "${value}")`;
}

// EndsWith function for checking if a field ends with a certain value
export function EndsWith(field: string, value: string): string {
  return `ENDS_WITH(${field}, "${value}")`;
}

// Contains function for checking if a field contains a certain value
export function Contains(field: string, value: string): string {
  return `CONTAINS(${field}, "${value}")`;
}

// IsNull function for checking if a field is null
export function IsNull(field: string): string {
  return `${field} IS NULL`;
}

// IsNotNull function for checking if a field is not null
export function IsNotNull(field: string): string {
  return `${field} IS NOT NULL`;
}

export function Where(
  conditions: Record<string, any>,
  logicalOperator: 'AND' | 'OR' = 'AND',
): string {
  const conditionStrings = Object.entries(conditions).map(
    ([key, value]) => `${key} = "${value}"`,
  );
  const joinedConditions = conditionStrings.join(` ${logicalOperator} `);
  return `(${joinedConditions})`;
}

export function OrderBy(
  fields: { field: string; direction?: 'ASC' | 'DESC' }[],
): string {
  const orderByClauses = fields
    .map(({ field, direction = 'ASC' }) => `${field} ${direction}`)
    .join(', ');
  return `ORDER BY ${orderByClauses}`;
}

// Limit function for specifying the maximum number of results to return
export function Limit(limit: number): string {
  return `LIMIT ${limit}`;
}

// Offset function for specifying the number of results to skip before returning
export function Offset(offset: number): string {
  return `OFFSET ${offset}`;
}
