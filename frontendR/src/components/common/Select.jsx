/* src/components/common/Select.jsx */
import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ label, name, value, onChange, onBlur, error, options, required = false }) => {
  return (
    <div className="relative z-0 w-full mb-5 group">
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
      >
        <option value="" disabled>-- {label} --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.display}</option>
        ))}
      </select>
      <label
        htmlFor={name}
        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
      >
        {label}
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    display: PropTypes.string.isRequired,
  })).isRequired,
  required: PropTypes.bool,
};

export default Select;
