import { SchemaDirectiveVisitor } from "graphql-tools";

import { defaultFieldResolver } from "graphql";

export default class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      //console.log(result)
      if (typeof result === "string") {
        return result.toUpperCase();
      }
      return result;
    };
  }
}

