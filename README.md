# Github-Issue-Listing
A simple function which uses the GitHub api(s) to retrieve information from the whole GitHub repository.
Instead of creating a server, this task can be easily completed by simple api calls from: https://developer.github.com/v3/ 
Using apis makes this project less complex.

- Link where this application is live:  https://infallible-babbage-428d49.netlify.com 

- NOTE: Every pull request is an issue, but not every issue is a pull request. For this reason, “shared” actions for both features, like manipulating assignees, labels and milestones, are provided within the Issues API. Thus an option for the user to choose whether to  include the open pull requests count along with issues has been provided.


# Github-Issue-Listing Future Work

- Using a third party plugin such as select2 or chosen, we can provide a search operation with autocomplete, where the user can select the repository name instead of providing the URL.

- Using promise variable to call all server functions asyncronously.

- Making this project more scaleable by caching and storing previous results.

- Making the webpage mobile optimized.
