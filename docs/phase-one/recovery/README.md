# Recovering original development commits

The connected GitHub app can create trees, commits and branch references. Its commit interface sets the author/committer metadata. The mirrored milestones have the same verified Git trees and record the original commit ID in their message. The bundle preserves the original objects, including d78fdd5, through bc5d526.

From a repository clone containing baseline 646bf5d4cb3997d8e98a66f38f7f375397bff792:

    git bundle verify docs/phase-one/recovery/original-development.bundle
    git fetch docs/phase-one/recovery/original-development.bundle refs/heads/development/pilgrim-companion-20261120:refs/heads/recovered/pilgrim-original
    git show --no-patch d78fdd5

This installs a separate recovery ref. Continue shared development on development/pilgrim-companion-20261120. The branch-scoped website preview is separate from production.
