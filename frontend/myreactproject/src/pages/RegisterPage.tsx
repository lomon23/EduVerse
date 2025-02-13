import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { validatePasswordStrength } from '../utils/validators';

// Створюємо схему валідації для форми через yup
const schema = yup.object({
  email: yup
    .string()
    .email('Невірний формат email')
    .required('Email є обов\'язковим'),
  password: yup
    .string()
    .required('Пароль є обов\'язковим')
    .test('password-strength', 'Пароль занадто слабкий', (value) => {
      return value ? validatePasswordStrength(value) : false;
    }),
}).required();

type FormData = {
  email: string;
  password: string;
};

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Функція для обробки події при натисканні кнопки
  const onSubmit = (data: FormData) => {
    console.log('Дані форми', data);
    // Тут буде логіка для реєстрації користувача
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          placeholder="Введіть ваш email"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Пароль:</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          placeholder="Введіть пароль"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit">Зареєструватися</button>
    </form>
  );
};

export default RegisterPage;
