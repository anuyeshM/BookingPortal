import rules from './rules';

const check = (rules, role, action, data) => {
  // check role
  const permissions = rules[role];
  if (!permissions) return false;

  // check static permissions
  const staticPermissions = permissions.static;
  if (staticPermissions && staticPermissions.includes(action)) return true;

  // check dynamic permissions
  const dynamicPermissions = permissions.dynamic;
  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) return false;

    return permissionCondition(data);
  }
  
  return false;
};
  
const Can = props =>
  check(rules, props.role, props.perform, props.data)
    ? props.yes()
    : props.no();

Can.defaultProps = {
  yes: () => null,
  no: () => null
};

export default Can;