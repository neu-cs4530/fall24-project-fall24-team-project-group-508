import React from 'react';
import { render, screen } from '@testing-library/react';
import Latex from 'react-latex';
import '@testing-library/jest-dom/extend-expect';

describe('Latex Rendering Tests', () => {
    test('renders fraction symbol', () => {
        render(
            <div>
            <Latex>{`What is $\\frac{3\\times 4}{5-3}$`}</Latex>
    < /div>
    );
    expect(screen.getByText(/What is \$\\frac\{3\\times 4\}\{5-3\}\$/i)).toBeInTheDocument();
});
});




