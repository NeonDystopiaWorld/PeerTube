# Spam Filter

  * [Explanation](#explanation)
  * [Setup](#setup)

## Explanation

The Spam Filter addition defined in `./server/core/lib/spam-filter.ts` helps to drop any and all attempts at registration from a user should the registration reason match something in your YAML config file to help out with smaller instances who may only have limited resources in regards to emailing. This config can perform both checks against string literals or use regular expressions to match the registration reason to your filters. This setting requires your instance to be set to request registration mode in order to be used.

## Setup

To setup your spam filter, go ahead and copy the provided `spam-filter.yaml.example` file and make your changes to it. Once complete, all that needs to be done is for you to set its path to the `$REG_SPAM_FILTER` environment variable for usage. It's just that simple! Make sure to restart your PeerTube instance with the request registration mode enabled for the filter to take effect.

The spam filter also creates logs of all the failed attempts from bad actors in a custom log file that you can define with the `$REG_SPAM_FILTER_LOG` environment variable, this will point PeerTube in the direction of the file to log all failed attempts to so firewall rules can be made or IPs can be forwarded to IP blacklists.