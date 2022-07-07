import create, { State } from "zustand";
import { ValidationError } from "yup";

export interface IForm<Values> extends State {
  values: Values;
  errors: Partial<Record<keyof Values, string>>;
  validationSchema: any;
  validate(): IForm<Values>["errors"];
  setValue<K extends keyof Values>(key: K, value: Values[K]): void;
  submit(): void;
}

export const useFormFactory = <Values>(
  initialValues: Values,
  onSubmit: (values: Values) => void,
  validationSchema: IForm<Values>["validationSchema"],
) =>
  create<IForm<Values>>((set, get) => ({
    values: JSON.parse(JSON.stringify(initialValues)),
    errors: {},
    validationSchema,
    validate: () => {
      const { values } = get();
      const errors: Partial<Record<keyof Values, string>> = {};
      Object.keys(values).map((key) => {
        try {
          validationSchema.validateSyncAt(key, values);
        } catch (err: any) {
          const errorPath = (err as ValidationError).params?.path || key;
          if ((err as ValidationError).errors) {
            errors[errorPath as keyof Values] = (
              err as ValidationError
            ).errors[0];
          }
        }
      });
      set({ errors });
      return errors;
    },
    setValue: (key, value) => {
      const { values } = get();
      const newValues = JSON.parse(JSON.stringify(values));
      newValues[key] = value;
      set({ values: newValues });
    },
    submit: () => {
      const { values, validate } = get();
      const errors = validate();
      if (Object.keys(errors).length !== 0) return;
      onSubmit(values);
    },
  }));
