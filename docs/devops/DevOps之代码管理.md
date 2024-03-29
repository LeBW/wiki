# DevOps代码管理

## 什么是代码管理？

代码管理（SCM）是程序员用来管理源代码的方法和工具。

代码管理用来给程序源代码以版本。每一个版本会有一个时间戳，并且记录提交这个版本的人员和改动的细节。在代码管理系统中，我们甚至可以比较各种版本并将其与其他版本合并。这就是为什么SCM也被称为版本控制或源代码控制的原因。

可能你以前也使用过你自己的「版本控制系统」，只是你没有意识到。例如：`resume-v1.pdf`, `resume-v2.pdf`，等。

## 为什么需要代码管理？

1. 作为数据备份。虽然数据备份同样可以用比较笨的方法：本地复制副本，但这种古老的方法有很多不足，无法应对频繁的修改，会照成版本混乱，不便于管理，并且占用空间。
2. 版本控制。 版本控制是一种记录一个或若干文件内容变化，以便将来查阅特定版本修订情况以及回溯的系统。 有了它你就可以将某个文件回溯到之前的状态，甚至将整个项目都回退到过去某个时间点的状态，你可以比较文件的变化细节，查出最后是谁修改了哪个地方，从而找出导致怪异问题出现的原因，又是谁在何时报告了某个功能缺陷等等。
3. 提高代码质量。在没有代码管理之前，可能经常要在代码里写些不相关的注释，比如：某人某日对某代码进行修改；或是将一些不确定是否使用的代码用注释的形式保留等等,这些也就是僵尸代码啦。现在这些工作都可以交由版本管理工具完成。
4. 提高协同、多人开发的效率。及时提交更新代码，能让团队中的成员了解到代码的最新情况，避免重复劳动。
5. 明确分工责任。什么时候谁对代码做了修改、修改了什么内容，版本管理都会记录在案，方便查询，追究责任。

## 代码管理工具简介

代码管理工具一般分为两种：集中式和分布式。分布式版本管理系统更加现代化，运行速度更快，有更多的高级特性，但是理解起来稍微复杂一些。你需要评估分布式带来的额外复杂度对于你的项目来说，是否是值得的。

比较流行的代码管理工具有 Git（分布式），Mercurial（分布式），Subversion（分布式）。

集中式和分布式的代码管理工具的主要区别在于代码仓库的数目。在集中式的代码管理系统中，代码只有一个中心仓库；在分布式系统中，可以同时存在多个代码仓库，如下图所示。

![Centralized version control](https://homes.cs.washington.edu/~mernst/advice/version-control-fig2.png)

![Distributed version control](https://homes.cs.washington.edu/~mernst/advice/version-control-fig3.png)

在集中式代码管理系统中，虽然每个用户会得到他的 working copy，但是只有一个中心仓库。当你提交commit后，其他人就可以执行update并且看到你的提交了。其他人想要看到你的提交，有两个前提：

1. 你成功提交了commit。
2. 他们成功执行了update。

在分布式代码管理系统中，每个用户都会有他自己的仓库和working copy。在你提交commit后，其他人还是没有办法收到该提交；只有当你把你的提交push到中心仓库后，其他人才有权限访问。另一方面，如果你仅仅是update，是得不到他人的提交的；只有你首先从中心仓库中执行pull操作拉取到本地你的仓库后，你才能看到其他人的commit。其他人想要看到你的提交，有4个前提：

1. 你成功提交了commit。
2. 你将commit push到了中心仓库。
3. 他们从中心仓库执行了pull操作。
4. 他们成功执行了update。

我们注意到，在分布式代码管理系统中，commit和update操作仅仅在本地仓库和你的working copy之间产生影响，不会影响其他人的仓库；而push和pull操作仅仅在本地仓库和中心仓库之间产生影响，而不会影响你的本地woking copy。

## 冲突（Conflicts）

代码管理系统允许多个用户同时编辑自己的working copy。通常，代码管理系统能够自动处理两个不同用户对同一版本的commit。

对于每一行代码，有以下几种情况：

* 如果两个用户都没有改变它，那么它保持原来的代码。
* 如果其中一个用户改变了它，那么它变成改变后的代码。
* 如果两个用户同时改变了它，并且改变的内容不同，那么冲突就产生了。

当产生冲突时，代码管理系统就无法自动帮我们处理了，因为它也不知道要使用谁的版本，那么这个时候就需要人工干预，决定如何处理这一行代码了。

在分布式代码管理系统中，有一个明确的操作叫`merge`，用来将不同用户上做的改变加以合并。有时候，merge操作能够自动执行完毕，但是当遇到冲突时，merge会自动暂停并等待用户执行下一步操作。而在集中式代码管理系统中，每次执行update时，中心仓库中会隐形地执行merge操作。

对于冲突，我们最理想的状态是避免它，而不是在发生后取解决它。下面的best practices给出了一些避免冲突的建议，例如开发者应该频繁地进行commit，而不是在大量改变内容后一次性执行commit。

## 合并（Merge changes）

回想一下，update操作的目的是：将仓库中发生的改变同步到用户的woking copy中。

在集中式的代码管理系统中，你可以在任何时刻（包括你在本地还有未提交的commit时）进行update操作。代码管理系统会将你的woking copy中未完成的commit与仓库中更新过来的commit进行自动的merge操作。这可能会使你在有时候不得不处理冲突，而且这也会使你的本地编辑发生改动，因为你现在只有merge后的版本了。这种隐形的merge操作是集中式代码管理系统中经常给用户带来困扰的地方。

在分布式代码管理系统中，如果你在本地的woking copy中还有未提交的commit时，你不能执行update操作（或者像`git pull`这类包括update的操作）。理由是代码管理系统认为在你编辑还未完成的时候进行update操作只会带来麻烦。所以你会收到一个类似这样的错误提示：`abort: outstanding uncommitted changes`。

如果你想要执行update操作，你必须首先将你所做的编辑全部commit提交掉。commit完成后，如果你想执行update操作，代码管理系统会提示你进行merge操作，因为此时你的本地仓库中的commit与中心仓库中即将update过来的commit之间是同步的关系。merge完毕后，将合并后的版本重新进行commit。这样，代码管理系统就包含了所有的版本变更的历史，既记录了你自己的commit详情，也记录了与其他更新进行merge过程的详情。



## 分支管理

虽然代码管理工具的基本功能已经很优秀，但是当我们面对版本管理的时候，依然存在很大的挑战。我们知道大家工作在同一仓库中，那么彼此的代码协作必然带来很多问题和挑战，如下：

1. 如何开始一个Feature的开发，而不影响别等Feature？
2. 由于很容易创建新分支，分支多了之后应该如何管理？时间久了，如何知道每个分支是干什么的？
3. 哪些分支已经合并到了主干？
4. 如何进行Release的管理？开始一个Release的时候，如何冻结Feature？如何在准备Release的时候，开发人员可以继续开发新的功能？
5. 线上代码出现bug了，如何快速修复（而且修复的代码要包含到开发人员的分支以及下一个Release）？

大部分开发人员在使用Git时就只是使用三个甚至两个分支，一个是Master，一个是Develop，还有一个基于Develop打得各种分支。这种模式在小项目的时候还能够勉强支撑，但是人员一多，项目周期一长，就会出现各种问题。



## Git Flow

就像代码需要代码规范一样，代码管理同样需要清晰的流程和规范。

Vincent Driessen 同学为了解决这个问题提出了 [A Successful Git Branching Model](http://nvie.com/posts/a-successful-git-branching-model/)

下面是Git Flow的流程图

![img](https://images.cnblogs.com/cnblogs_com/cnblogsfans/771108/o_git-flow-nvie.png)

下面介绍Git Flow常用的分支

- Production 分支

也就是我们经常使用的Master分支，这个分支最近发布到生产环境的代码，最近发布的Release， 这个分支只能从其他分支合并，不能在这个分支直接修改

- Develop 分支

这个分支是我们是我们的主开发分支，包含所有要发布到下一个Release的代码，这个主要合并与其他分支，比如Feature分支

- Feature 分支

这个分支主要是用来开发一个新的功能，一旦开发完成，我们合并回Develop分支进入下一个Release

- Release分支

当你需要一个发布一个新Release的时候，我们基于Develop分支创建一个Release分支，完成Release后，我们合并到Master和Develop分支

- Hotfix分支

当我们在Production发现新的Bug时候，我们需要创建一个Hotfix, 完成Hotfix后，我们合并回Master和Develop分支，所以Hotfix的改动会进入下一个Release



### Git Flow 如何工作？

#### Master 分支

所有在Master分支上的Commit应该Tag

![img](https://images.cnblogs.com/cnblogs_com/cnblogsfans/771108/o_git-workflow-release-cycle-1historical.png)

#### Feature 分支

分支名 feature/*

Feature分支做完后，必须合并回Develop分支, 合并完分支后一般会删点这个Feature分支，但是我们也可以保留

![img](https://images.cnblogs.com/cnblogs_com/cnblogsfans/771108/o_git-workflow-release-cycle-2feature.png)

#### Release 分支

分支名 release/*

Release分支基于Develop分支创建，打完Release分之后，我们可以在这个Release分支上测试，修改Bug等。同时，其它开发人员可以基于开发新的Feature (记住：一旦打了Release分支之后不要从Develop分支上合并新的改动到Release分支)

发布Release分支时，合并Release到Master和Develop， 同时在Master分支上打个Tag记住Release版本号，然后可以删除Release分支了。

![img](https://images.cnblogs.com/cnblogs_com/cnblogsfans/771108/o_git-workflow-release-cycle-3release.png)

#### HotFix 分支

分支名 hotfix/*

hotfix分支基于Master分支创建，开发完后需要合并回Master和Develop分支，同时在Master上打一个tag

![img](https://images.cnblogs.com/cnblogs_com/cnblogsfans/771108/o_git-workflow-release-cycle-4maintenance.png)

## 参考博客
[A successful git branching model](https://nvie.com/posts/a-successful-git-branching-model)

[Gitflow Workflow | Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

[Git 在团队中的最佳实践--如何正确使用Git Flow](https://www.cnblogs.com/wish123/p/9785101.html)