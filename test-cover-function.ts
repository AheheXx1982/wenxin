import { getDefaultCoversForPath } from './src/lib/cover';

// 测试期权卖方策略路径
console.log('Testing 期权卖方策略 path:');
const sellingStrategyCovers = getDefaultCoversForPath('/categories/现金流乌托邦/期权卖方策略');
console.log('Selling strategy covers:', sellingStrategyCovers);

// 测试直接的期权卖方策略路径
console.log('\nTesting direct 期权卖方策略 path:');
const directSellingStrategyCovers = getDefaultCoversForPath('期权卖方策略');
console.log('Direct selling strategy covers:', directSellingStrategyCovers);
