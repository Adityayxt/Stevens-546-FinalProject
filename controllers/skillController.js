import Skill from '../models/Skill.js';
import Comment from '../models/Comment.js';

export const getAllSkills = async () => {
  return await Skill.find().populate('postedBy').sort({ createdAt: -1 });
};

export const getSkillById = async (id) => {
  return await Skill.findById(id).populate('postedBy');
};

export const getCommentsBySkillId = async (id) => {
  return await Comment.find({ skill: id }).populate('postedBy');
};

export const createSkill = async (data) => {
  const skill = new Skill(data);
  return await skill.save();
};