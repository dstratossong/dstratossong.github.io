Using CanCanCan
===============

[CanCanCan](https://github.com/CanCanCommunity/cancancan) is a gem for permissions used in Rails development. The original gem, [CanCan](https://github.com/ryanb/cancan) was developed by Ryan Bates of Rails Casts. After he stopped supporting the project since Rails 3, the community picked up the project, maintaining much of the original features over the years.

[TOC]

### Extracting permissions to a single class

To use permissions, we first have to define them, and this is done in the file `ability.rb`. In here, CanCanCan provides the flexible `can` and `cannot` methods, which we can use to check the abilities of the `current_user` against a resource. More specifically, we can define rules to use against a specific instance of a model, for example `project`. This instance does not restrict to a model: 
```ruby
# ability.rb
can :manage, WelcomeController
can [:edit, :update], Project do |project|
  user == project.owner
end

# welcome_controller.rb
authorize! :index, self
```
A controller like the `WelcomeController` does not have a model instance which it manages. In this case, we check against the controller itself in a method, passing `self` to the `authorize` method (taking advantage of Ruby as an object oriented language). In the `ProjectController`, we can pass in the `@project` instance and get the appropriate response. 

By using CanCanCan's setup, we eliminate those scattered if-statements that usually hang around the beginning of a method like:
```ruby
# some_controller.rb
def show
  @model = Model.find(params[:id])
  if @model.user == current_user
    # do something
  else
    # throw something
  end
end
```
Moreover, we have collected all the rules into a single method, which makes changing permissions much easier. The only possible downside might be that it makes creating new scaffolds a bit harder, as you'd have to worry about setting permissions much before you'd prefer to. 

A worry that came up, especially with developers who have experience dealing large-scale applications, is that they prefer to define permissions in the database[^database]. In a simple and rapid product pushing environment, we argue that if we change permissions, we at least have to change something somewhere else in the codebase. This is saying that we simply cannot handle on-the-fly permission changing with the current state of code. Therefore, we'd have to redeploy anyway, so we can keep permission as part of the codebase. CanCanCan does in fact provide loading database permissions. See [Database Permissions](https://github.com/CanCanCommunity/cancancan/wiki/Abilities-in-Database) 

### Thinning controllers

CanCanCan provides methods that eliminates repeating lines in controllers, a feature that greatly accommodates Rails' DRY philosophy. For example, this could further reduce the `show` method:
```ruby
# some_controller.rb

# before
def show
  @model = Model.find(params[:id])
  authorize! :read, @model
end

# after
load_and_authorize_resource
def show
  # nothing is needed
end
```
This `load_and_authorize_resource` method is in the scope of the entire class, so other methods do not have to explicitly find their methods at all. In methods like `create` and `update`, CanCanCan expects a method defined as `model_params` (where model is the name of the specific model), and this enforces the usage of strong parameters as well (Rails 4+). 

Variations to this method, `load_resource` and `authorize_resource`, are both provided. All three variations can take a symbol for the name of the model to load, which is defaulted to the name of the controller. The extended benefit of this feature is that it accounts for nested resources:
```ruby
# routes.rb
resources :project do
  resources :tasks
end

# tasks_controller.rb
load_and_authorize_resource :project
load_and_authorize_resource :task, through: :project
```
This gives us a `@project` and `@task` instance in every method, and also gives us incentive to use Rails' resourceful routes. 

Furthermore, CanCanCan has the assurance method `check_authorization` that, when put in `ApplicationController`, will raise an exception if any method of any controller does not have the authorize method. CanCanCan allows us to skip checks for specific controllers by adding `skip_authorization_check`. We don't encourage using this method because it lets business logic slip into specific controllers when we have already encapsulated it well. We use the trick of checking for controller instances (see before) to ensure we have an authorize for each method. We encourage developers to define abilities first and not wait until their scaffold is complete, as it will eliminate mistakes of forgetting permission checking. See also, [Integration Testing](https://github.com/CanCanCommunity/cancancan/wiki/Testing-Abilities).

### Abstracting business logic from views

CanCanCan allows us to check permissions in the views too; we take full advantage of this:
```
# ability.rb
can :follow, Profile do |profile|
  (user.profile != profile) and (not UserFollow.find_by(follower_id: user.id, followee_id: profile.user.id))
end
can :unfollow, Profile do |profile|
  (user.profile != profile) and UserFollow.find_by(follower_id: user.id, followee_id: profile.user.id)
end
    
<!-- _follow_button.html.erb -->
<%= button_to 'Follow', follow_profile_path(profile) if can? :follow, profile %>
<%= button_to 'Unfollow', unfollow_profile_path(profile) if can? :unfollow, profile %>
```
Here, if a user can both follow and unfollow a profile, they would definitely see both buttons. We control this inside `ability.rb`, where it is impossible for both permissions to satisfy. There are cases where a user can neither follow nor unfollow a user (e.g. they are seeing their own profile). This logic is all handled inside ability, and the view is left only in charge of presentation.
