import React, { useState } from 'react';

export default function MathCalculators() {
  const [legA, setLegA] = useState('');
  const [legB, setLegB] = useState('');
  const [area, setArea] = useState(null);

  const [n, setN] = useState('');
  const [r, setR] = useState('');
  const [combination, setCombination] = useState(null);
  const [permutation, setPermutation] = useState(null);

  const calculateArea = () => {
    const a = parseFloat(legA);
    const b = parseFloat(legB);
    
    if (!isNaN(a) && !isNaN(b) && a > 0 && b > 0) {
      const calculatedArea = (a * b) / 2;
      setArea(calculatedArea);
    } else {
      setArea(null);
    }
  };

  const factorial = (num) => {
    if (num < 0) return null;
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  const calculateCombinationAndPermutation = () => {
    const nVal = parseInt(n);
    const rVal = parseInt(r);
    
    if (!isNaN(nVal) && !isNaN(rVal) && nVal >= 0 && rVal >= 0 && rVal <= nVal) {
      // Permutation: P(n,r) = n! / (n-r)!
      const nFactorial = factorial(nVal);
      const nMinusRFactorial = factorial(nVal - rVal);
      const perm = nFactorial / nMinusRFactorial;
      
      // Combination: C(n,r) = n! / (r! * (n-r)!)
      const rFactorial = factorial(rVal);
      const comb = nFactorial / (rFactorial * nMinusRFactorial);
      
      setPermutation(perm);
      setCombination(comb);
    } else {
      setPermutation(null);
      setCombination(null);
    }
  };

  React.useEffect(() => {
    calculateArea();
  }, [legA, legB]);

  React.useEffect(() => {
    calculateCombinationAndPermutation();
  }, [n, r]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white space-y-12">
      {/* Triangle Calculator */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Right angled triangle</h3>
        <div className="text-lg mb-4">
          Solve for: <span className="font-medium">area</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-xl font-semibold mb-2">
            A = {area !== null ? area.toFixed(2) : '___'}
          </div>
          <div className="text-gray-600 text-sm">
            Formula: A = (a · b) / 2
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 text-xl font-semibold">a</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Leg</div>
                <input
                  type="number"
                  value={legA}
                  onChange={(e) => setLegA(e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Value of Leg a"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 text-xl font-semibold">b</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Leg</div>
                <input
                  type="number"
                  value={legB}
                  onChange={(e) => setLegB(e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Value of Leg b"
                />
              </div>
            </div>

            {(legA && parseFloat(legA) <= 0) && (
              <div className="text-red-600 text-sm">
                The variable <span className="font-semibold">a</span> should be positive
              </div>
            )}
            {(legB && parseFloat(legB) <= 0) && (
              <div className="text-red-600 text-sm">
                The variable <span className="font-semibold">b</span> should be positive
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <svg width="237" height="148" viewBox="0 0 474 296" className="max-w-full">
              <rect fill="#f8f9fa" height="296" width="474" />
              
              {/* Triangle lines */}
              <line x1="413" y1="263" x2="61" y2="33" stroke="#1a73e8" strokeWidth="2" />
              <line x1="60" y1="263" x2="414" y2="263" stroke="#1a73e8" strokeWidth="2" />
              <line x1="61" y1="32" x2="61" y2="264" stroke="#1a73e8" strokeWidth="2" />
              
              {/* Right angle marker */}
              <polyline points="62,239 85,239 85,262" fill="none" stroke="#1a73e8" strokeWidth="2" />
              
              {/* Labels */}
              <text x="214" y="146" fontSize="18" fill="#1a73e8" textAnchor="middle">c</text>
              <text x="215" y="271" fontSize="18" fill="#1a73e8" textAnchor="middle">b</text>
              <text x="51" y="166" fontSize="18" fill="#1a73e8" textAnchor="middle">a</text>
            </svg>
          </div>
        </div>

        {area !== null && legA && legB && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="font-semibold mb-2">Solution</div>
            <div className="text-lg">
              A = (a · b) / 2 = ({legA} · {legB}) / 2 = <span className="font-bold">{area.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quadratic Formula */}
      <div className="pt-6 border-t border-gray-200">
        <h1 className='text-2xl font-semibold mb-4'>Quadratic Formula</h1>
        <div className="flex justify-center">
          <img 
            className="max-w-full h-auto"
            alt="x = \frac{ -b \pm \sqrt{b^2 - 4ac}}{2a} when ax^2 + bx + c = 0" 
            src="https://www.gstatic.com/education/formulas2/553212783/en/quadratic_formula.svg"
            role="img"
          />
        </div>
      </div>

      {/* Combination and Permutation Calculator */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-2xl font-semibold mb-4">Combinations and Permutations</h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold mb-2">Combination</div>
            <div className="text-2xl font-bold mb-2">
              C(n,r) = {combination !== null ? combination.toLocaleString() : '___'}
            </div>
            <div className="text-gray-600 text-sm">
              Formula: C(n,r) = n! / (r! · (n-r)!)
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold mb-2">Permutation</div>
            <div className="text-2xl font-bold mb-2">
              P(n,r) = {permutation !== null ? permutation.toLocaleString() : '___'}
            </div>
            <div className="text-gray-600 text-sm">
              Formula: P(n,r) = n! / (n-r)!
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 text-xl font-semibold">n</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Total number of items</div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Value of n"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 text-xl font-semibold">r</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Number of items to choose</div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={r}
                  onChange={(e) => setR(e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Value of r"
                />
              </div>
            </div>

            {(n && parseInt(n) < 0) && (
              <div className="text-red-600 text-sm">
                The variable <span className="font-semibold">n</span> should be non-negative
              </div>
            )}
            {(r && parseInt(r) < 0) && (
              <div className="text-red-600 text-sm">
                The variable <span className="font-semibold">r</span> should be non-negative
              </div>
            )}
            {(n && r && parseInt(r) > parseInt(n)) && (
              <div className="text-red-600 text-sm">
                The variable <span className="font-semibold">r</span> cannot be greater than <span className="font-semibold">n</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎲</div>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Combination:</strong> Order doesn't matter</p>
                <p className="text-xs">Example: Choosing 3 fruits from 5</p>
                <p className="mt-4"><strong>Permutation:</strong> Order matters</p>
                <p className="text-xs">Example: Arranging 3 people in 5 seats</p>
              </div>
            </div>
          </div>
        </div>

        {combination !== null && permutation !== null && n && r && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-4">
            <div>
              <div className="font-semibold mb-2">Combination Solution</div>
              <div className="text-lg">
                C({n},{r}) = {n}! / ({r}! · ({n}-{r})!) = {combination.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Permutation Solution</div>
              <div className="text-lg">
                P({n},{r}) = {n}! / ({n}-{r})! = {permutation.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}