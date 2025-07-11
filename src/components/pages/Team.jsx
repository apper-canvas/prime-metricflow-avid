import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import TeamMembersList from "@/components/organisms/TeamMembersList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { teamService } from "@/services/api/teamService";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "member",
    message: ""
  });

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamService.getMembers();
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleInviteMember = async (e) => {
    e.preventDefault();
    try {
      await teamService.inviteMember(inviteForm);
      toast.success("Invitation sent successfully!");
      setShowInviteForm(false);
      setInviteForm({ email: "", role: "member", message: "" });
      loadMembers();
    } catch (err) {
      toast.error("Failed to send invitation");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await teamService.removeMember(memberId);
      setMembers(prev => prev.filter(member => member.Id !== memberId));
    } catch (err) {
      throw new Error("Failed to remove member");
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      await teamService.updateMemberRole(memberId, newRole);
      setMembers(prev => 
        prev.map(member => 
          member.Id === memberId ? { ...member, role: newRole } : member
        )
      );
    } catch (err) {
      throw new Error("Failed to update role");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} onRetry={loadMembers} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Team Management</h1>
          <p className="text-gray-400 mt-1">
            Manage your team members and their access permissions.
          </p>
        </div>
        
        <Button 
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="UserPlus" size={16} />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
              <ApperIcon name="Users" size={20} className="text-primary-400" />
            </div>
<div>
              <h3 className="text-2xl font-bold text-black">{members.length}</h3>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-secondary-500/20 to-accent-500/20">
              <ApperIcon name="Shield" size={20} className="text-secondary-400" />
            </div>
<div>
              <h3 className="text-2xl font-bold text-black">
                {members.filter(m => m.role === "admin").length}
              </h3>
              <p className="text-sm text-gray-600">Admins</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent-500/20 to-primary-500/20">
              <ApperIcon name="UserCheck" size={20} className="text-accent-400" />
            </div>
<div>
              <h3 className="text-2xl font-bold text-black">
                {members.filter(m => m.status === "active").length}
              </h3>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
<Card className="p-6">
            <h3 className="text-lg font-semibold text-black mb-4">
              Invite New Member
            </h3>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Email Address"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
                
<div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800 block">
                    Role
                  </label>
                  <select
                    value={inviteForm.role}
onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full h-10 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <FormField
                label="Message (Optional)"
                value={inviteForm.message}
                onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Add a personal message to the invitation"
              />
              
              <div className="flex gap-3">
                <Button type="submit" className="flex items-center gap-2">
                  <ApperIcon name="Send" size={16} />
                  Send Invitation
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowInviteForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Team Members List */}
      {members.length === 0 ? (
        <Empty
          icon="Users"
          title="No team members"
          description="Your team is empty. Start by inviting your first member."
          actionLabel="Invite Member"
          onAction={() => setShowInviteForm(true)}
        />
      ) : (
        <TeamMembersList
          members={members}
          onRemoveMember={handleRemoveMember}
          onUpdateRole={handleUpdateRole}
        />
      )}
    </motion.div>
  );
};

export default Team;