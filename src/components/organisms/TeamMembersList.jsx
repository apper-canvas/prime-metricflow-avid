import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const TeamMembersList = ({ members, onRemoveMember, onUpdateRole, className }) => {
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (memberId, newRole) => {
    setLoading(true);
    try {
      await onUpdateRole(memberId, newRole);
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      setLoading(true);
      try {
        await onRemoveMember(memberId);
        toast.success("Member removed successfully");
      } catch (error) {
        toast.error("Failed to remove member");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {members.map((member, index) => (
        <motion.div
          key={member.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  src={member.avatar}
                  fallback={member.name.charAt(0)}
                  size="lg"
/>
                <div>
                  <h3 className="font-semibold text-black">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={member.role === "admin" ? "primary" : "secondary"}>
                      {member.role}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={member.role}
onChange={(e) => handleRoleChange(member.Id, e.target.value)}
                  disabled={loading}
                  className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.Id)}
                  disabled={loading}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <ApperIcon name="UserMinus" size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamMembersList;