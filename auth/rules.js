/**
 * RULES GUIDELINES
 * 
 * static
 *   + static rules of format [page:action] e.g. login:visit
 * 
 * action types
 *   + visit [subset of read, can go to page, but can't see any data]
 *   + create
 *   + read
 *   + update
 *   + delete
 * 
 * users to be in sync with auth api from backend, user to be configured as is
 *   e.g. admin, manager, user etc.
 */

const rules = {
    manager: {
        static: [
            "login:visit",
            "dashboard:read",
        ],
        dynamic: {}
    },
    admin: {
        static: [
            "login:visit",
            "dashboard:read",
        ],
        dynamic: {}
    }
  };
  
  export default rules;