let args = {
  production: false,
  changed: false,
};

if (process.argv.length > 2) {
  // add taskname to the args
  args.taskName = process.argv[2];

  // add every other argument to object of args as keys (so no --arg="this-is-the-value")! ONLY BOOLEAN SUPPORT
  process.argv.slice(3).forEach(arg => {
    if (arg.substr(0, 2) === '--') arg = arg.substr(2);
    args[arg] = true;
  });

  // also, for tasks that end with -changed, set args changed to true
  if (args.taskName.indexOf('-changed') > -1) {
    args.changed = true;
  }
}

module.exports = args;
