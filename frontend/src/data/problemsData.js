const problems = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    short: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists'],
    starter: {
      js: `function twoSum(nums, target) {\n  // write your solution here\n}\n\n// example: console.log(twoSum([2,7,11,15], 9));`,
      python: `def twoSum(nums, target):\n    # write your solution here\n    pass\n\n# example: print(twoSum([2,7,11,15], 9))`
    },
    tests: [
      { input: { nums: [2,7,11,15], target: 9 }, expected: '[0,1]' },
      { input: { nums: [3,2,4], target: 6 }, expected: '[1,2]' },
      { input: { nums: [3,3], target: 6 }, expected: '[0,1]' }
    ]
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    short: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    examples: [
      { input: "s = ['h','e','l','l','o']", output: "['o','l','l','e','h']" }
    ],
    constraints: ['1 <= s.length <= 10^5'],
    starter: {
      js: `function reverseString(s) {\n  // write your solution here\n}\n\n// example: reverseString(['h','e','l','l','o']);`,
      python: `def reverseString(s):\n    # write your solution here\n    pass\n\n# example: reverseString(['h','e','l','l','o'])`
    },
    tests: [
      { input: { s: ['h','e','l','l','o'] }, expected: "['o','l','l','e','h']" }
    ]
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    short: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.',
    examples: [
      { input: "s = 'A man, a plan, a canal: Panama'", output: 'true' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    starter: {
      js: `function isPalindrome(s) {\n  // write your solution here\n}\n\n// example: console.log(isPalindrome("A man, a plan, a canal: Panama"));`,
      python: `def isPalindrome(s):\n    # write your solution here\n    pass\n\n# example: print(isPalindrome("A man, a plan, a canal: Panama"))`
    },
    tests: [
      { input: { s: 'A man, a plan, a canal: Panama' }, expected: 'true' },
      { input: { s: 'race a car' }, expected: 'false' }
    ]
  }
];

export default problems;
