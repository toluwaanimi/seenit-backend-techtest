import {
  ICouchbaseQueryBuilder,
  OrderDirection,
  PartialCondition,
} from '../../../domain/adapters/couchbase.query.builder.interface';

export function ILike<T>(
  field: keyof T,
  value: T[keyof T] extends string ? string : never,
): PartialCondition<T> {
  const condition: PartialCondition<T> = {};
  // @ts-ignore
  const lowerField = `LOWER(${field})`;
  const lowerValue = typeof value === 'string' ? `LOWER(${value})` : value;
  condition[lowerField as keyof T] = {
    $relational: '=',
    $value: `${lowerValue}`,
  };
  return condition;
}

export function Equal<T>(
  field: keyof T,
  value: T[keyof T],
): PartialCondition<T> {
  const condition: PartialCondition<T> = {};
  condition[field] = { $relational: '=', $value: value };
  return condition;
}

export function NotEqual<T>(
  field: keyof T,
  value: T[keyof T],
): PartialCondition<T> {
  const condition: PartialCondition<T> = {};
  condition[field] = { $relational: '!=', $value: value };
  return condition;
}

export function In<T>(
  field: keyof T,
  values: T[keyof T][],
): PartialCondition<T> {
  const condition: PartialCondition<T> = {};
  condition[field] = { $relational: 'IN', $value: values };
  return condition;
}

export function NotIn<T>(
  field: keyof T,
  values: T[keyof T][],
): PartialCondition<T> {
  const condition: PartialCondition<T> = {};
  condition[field] = { $relational: 'NOT IN', $value: values };
  return condition;
}

export function GreaterThan<T>(
  field: keyof T,
  value: T[keyof T],
): PartialCondition<T> {
  const condition: PartialCondition<T> = {};
  condition[field] = { $relational: '>', $value: value };
  return condition;
}

export function LessThan<T>(
  field: keyof T,
  value: T[keyof T],
): PartialCondition<T> {
  const condition: PartialCondition<T> = {};
  condition[field] = { $relational: '<', $value: value };
  return condition;
}

export function GreaterThanOrEqual<T>(
  field: keyof T,
  value: T[keyof T],
): PartialCondition<T> {
  const condition: PartialCondition<T> = {};
  condition[field] = { $relational: '>=', $value: value };
  return condition;
}

export function LessThanOrEqual<T>(
  field: keyof T,
  value: T[keyof T],
): PartialCondition<T> {
  const condition: PartialCondition<T> = {};
  condition[field] = { $relational: '<=', $value: value };
  return condition;
}

export class CouchbaseQueryBuilder<T> implements ICouchbaseQueryBuilder<T> {
  private operation: 'SELECT' | 'UPDATE' | 'DELETE' = 'SELECT';
  private selectColumns: (keyof T | string)[];
  private fromClause: string;
  private whereClause: string;
  private orderByClause: string;
  private limitClause: string;
  private offsetClause: string;
  private updateValues: Partial<T>;

  constructor() {
    this.selectColumns = [];
    this.fromClause = '';
    this.whereClause = '';
    this.orderByClause = '';
    this.limitClause = '';
    this.offsetClause = '';
    this.updateValues = {};
  }

  findOne(): CouchbaseQueryBuilder<T> {
    this.operation = 'SELECT';
    this.selectColumns = ['*'];
    this.limitClause = 'LIMIT 1 ';
    return this;
  }

  findAll(): CouchbaseQueryBuilder<T> {
    this.operation = 'SELECT';
    this.selectColumns = ['*'];
    return this;
  }

  select(columns: (keyof T | string)[]): CouchbaseQueryBuilder<T> {
    this.operation = 'SELECT';
    this.selectColumns = columns;
    return this;
  }

  from(table: string): CouchbaseQueryBuilder<T> {
    this.fromClause = `FROM ${table} `;
    return this;
  }

  where(
    conditions: PartialCondition<T> | PartialCondition<T>[],
  ): CouchbaseQueryBuilder<T> {
    if (Array.isArray(conditions)) {
      this.whereClause = `WHERE (${conditions.map(this.formatCondition).join(') OR (')}) `;
    } else {
      if (Object.keys(conditions).length === 0) {
        return this;
      }
      this.whereClause = `WHERE (${this.formatCondition(conditions)}) `;
    }
    return this;
  }

  andWhere(conditions: PartialCondition<T>): CouchbaseQueryBuilder<T> {
    if (this.whereClause === '') {
      this.whereClause = `WHERE (${this.formatCondition(conditions)}) `;
    } else {
      this.whereClause += `AND (${this.formatCondition(conditions)}) `;
    }
    return this;
  }

  orWhere(conditions: PartialCondition<T>[]): CouchbaseQueryBuilder<T> {
    if (this.whereClause === '') {
      this.whereClause = `WHERE (${conditions.map(this.formatCondition).join(' OR ')}) `;
    } else {
      this.whereClause += `OR (${conditions.map(this.formatCondition).join(' OR ')}) `;
    }
    return this;
  }

  orderBy(
    field?: keyof T | string,
    direction?: OrderDirection,
  ): CouchbaseQueryBuilder<T> {
    if (!field) {
      return this;
    }
    if (this.orderByClause === '') {
      this.orderByClause = `ORDER BY ${String(field)} ${direction || 'ASC'} `;
    } else {
      this.orderByClause += `, ${String(field)} ${direction || 'ASC'} `;
    }
    return this;
  }

  limit(limit: number): CouchbaseQueryBuilder<T> {
    this.limitClause = `LIMIT ${limit} `;
    return this;
  }

  offset(offset: number): CouchbaseQueryBuilder<T> {
    this.offsetClause = `OFFSET ${offset} `;
    return this;
  }

  update(values: Partial<T>): CouchbaseQueryBuilder<T> {
    this.operation = 'UPDATE';
    this.updateValues = values;
    return this;
  }

  delete(): CouchbaseQueryBuilder<T> {
    this.operation = 'DELETE';
    return this;
  }

  build(): string {
    switch (this.operation) {
      case 'SELECT':
        const selectClause =
          this.selectColumns.length > 0
            ? `SELECT ${this.selectColumns.join(', ')} `
            : 'SELECT * ';
        return `${selectClause}${this.fromClause}${this.whereClause}${this.orderByClause}${this.limitClause}${this.offsetClause};`;
      case 'UPDATE':
        const updateClause = `UPDATE ${this.fromClause} SET ${Object.keys(
          this.updateValues,
        )
          .map(
            (field) =>
              `${String(field)} = ${typeof this.updateValues[field] === 'string' ? `"${this.updateValues[field]}"` : this.updateValues[field]}`,
          )
          .join(', ')}`;
        return `${updateClause}${this.whereClause};`;
      case 'DELETE':
        return `DELETE ${this.fromClause}${this.whereClause};`;
      default:
        throw new Error('Unsupported operation');
    }
  }

  private formatCondition(
    condition: PartialCondition<T> | { [x: string]: any },
  ): string {
    if (Array.isArray(condition)) {
      const formattedConditions = condition.map((cond) => {
        return Object.keys(cond)
          .map((field) => {
            const value = cond[field];
            if (
              typeof value === 'object' &&
              '$relational' in value &&
              '$value' in value
            ) {
              const formattedValue = Array.isArray(value.$value)
                ? `(${value.$value.map((v) => (typeof v === 'number' || typeof v === 'boolean' ? v : `"${v}"`)).join(', ')})`
                : typeof value.$value === 'number' ||
                    typeof value.$value === 'boolean'
                  ? value.$value
                  : `"${value.$value}"`;
              return `${field} ${value.$relational} ${formattedValue}`;
            } else {
              const formattedValue =
                typeof value === 'number' || typeof value === 'boolean'
                  ? value
                  : `"${value}"`;
              return `${field} = ${formattedValue}`;
            }
          })
          .join(' OR ');
      });
      return '(' + formattedConditions.join(') OR (') + ')';
    }

    const conditions: string[] = [];
    for (const field in condition) {
      if (condition.hasOwnProperty(field)) {
        const conditionObj = condition[field];
        if (
          typeof conditionObj === 'object' &&
          '$relational' in conditionObj &&
          '$value' in conditionObj
        ) {
          const formattedValue = Array.isArray(conditionObj.$value)
            ? `(${conditionObj.$value.map((v) => (typeof v === 'number' || typeof v === 'boolean' ? v : `"${v}"`)).join(', ')})`
            : typeof conditionObj.$value === 'number' ||
                typeof conditionObj.$value === 'boolean'
              ? conditionObj.$value
              : `"${conditionObj.$value}"`;
          conditions.push(
            `${field} ${conditionObj.$relational} ${formattedValue}`,
          );
        } else {
          const formattedValue =
            typeof conditionObj === 'number' ||
            typeof conditionObj === 'boolean'
              ? conditionObj
              : `"${conditionObj}"`;
          conditions.push(`${field} = ${formattedValue}`);
        }
      }
    }
    return conditions.join(' AND ');
  }
}
