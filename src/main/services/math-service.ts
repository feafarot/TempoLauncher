import { evaluate } from 'mathjs';

export class MathService {
  evalExpr(expr: string) {
    try {
      const res = evaluate(expr) as string + '';
      if (res.startsWith('function')) {
        return null;
      }

      return res;
    }
    catch {
      return null;
    }
  }
}

export const mathService = new MathService();
