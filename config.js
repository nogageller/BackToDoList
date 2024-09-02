switch (process.env.NODE_ENV) {
    case 'test':
        require('dotenv').config({ path: '.env.test' })
        break
    default:
        require('dotenv').config({ path: '.env' })
        break
}
