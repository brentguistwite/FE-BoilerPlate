## Setup
- Clone this onto your dev partition in a folder called boiler(otherwise change the path inside the boiler function)
- Add the following function to your bash profile.
- Run ```source ~/.bash_profile```

```sh
boiler ()
{
  OPTIND=1
  while getopts n: flag
  do
    case "${flag}" in
      n) fileName=${OPTARG};;
    esac
  done

  node '/Volumes/dev/boiler/index.js' fileName:"$fileName"
}
```

## Using boiler
1.  In the terminal, cd into the directory where you wish to add the new folder.
2.  Then run the following command, where MyComponentName is the name of the component you are creating.
```
boiler -n MyComponentName
```
