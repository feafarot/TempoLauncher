class ArraySchemaBuilder<TItem> {

}

class SchemaBuilder<TRoot> {
  private constructor() {

  }

  static asArray<TRoot>() {
    return new SchemaBuilder<TRoot>();
  }
}
