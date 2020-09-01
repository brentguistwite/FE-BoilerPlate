## Setup
Add the following function to your bash profile

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

boiler -n MyComponentName