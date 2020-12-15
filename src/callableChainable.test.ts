import { nested } from './nested'
import { pathsToCallableProxy } from './callableChainable'
import { routesNoSlashes } from './route.mock'

describe('CallableChainable', () => {
	const path = pathsToCallableProxy(nested('', routesNoSlashes))
	
	test('calling each chainable path property with parameters returns full path', () => {
		expect(path()).toEqual('/')
		expect(path.users({})).toEqual('/users')
		expect(path.users.user({ userId: 1 })).toEqual('/users/1')
		expect(path.users.user.edit({ userId: 1 })).toEqual('/users/1/edit')
		expect(path.users.user.accounts({ userId: 1 })).toEqual('/users/1/accounts')
		expect(path.users.user.accounts.account({ userId: 1, accountId: 1 })).toEqual('/users/1/accounts/1')
	})

	test('calling each chainable path property with no parameters returns route definition', () => {
		expect(path.users()).toEqual('/users')
		expect(path.users.user()).toEqual('/users/:userId')
		expect(path.users.user.edit()).toEqual('/users/:userId/edit')
		expect(path.users.user.accounts()).toEqual('/users/:userId/accounts')
		expect(path.users.user.accounts.account()).toEqual('/users/:userId/accounts/:accountId')
	})
})