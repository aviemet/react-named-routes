import { generatePath } from "react-router"

import { INDEX } from './nested'

// Convert routes object to paths object
export const pathsToCallableProxy = (routes: object): any => {
	return new Proxy(new CallableChainable(routes), callableChainableHandler)
}

// Object who's elements are both chainable and callable
export class CallableChainable extends Function {
	constructor(routes: object) {
		super()

		this[INDEX] = routes[INDEX]

		for(const [key, value] of Object.entries(routes)) {
			if(key !== INDEX) {
				const route = {}
				route[key] = value
				this[key] = new Proxy(new CallableChainable(value), callableChainableHandler)
			}
		}

    //@ts-ignore
		return new Proxy(this, callableChainableHandler)
	}
}

// Proxy second argument
const callableChainableHandler = {
	get: function(target: object, key: string) {
		// Ignore node inspection triggering Symbol util.inspect.custom trap (happens in jest)
		if(typeof key !== 'string') return
		if(!target[key]) {
			throw new Error(`Error: route ${target[INDEX]}/${key} does not exist`)
		}
		return target[key]
	},
	apply: function(target: object, _: object, args: any[]) {
		if(args.length > 0) {
			return generatePath(target[INDEX], args[0])
		}
		return target[INDEX]
	}
}
