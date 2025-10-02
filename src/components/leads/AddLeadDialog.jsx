import React, { useState } from "react";
import { Lead } from "@/entities/all";
import { ScoreLead } from "@/integrations/core"; // Import ScoreLead
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  position: "",
  status: "new",
  source: "other",  // CHANGED from "manual" to "other"
  estimated_value: 0,
  industry: "Other", // CHANGED from "" to "Other"
  company_size: "",
  notes: "",
};

export default function AddLeadDialog({ open, onClose, onLeadAdded }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  console.log('=== Starting Lead Creation Process ===');
  console.log('Form data:', formData);
  
  try {
    // 1. Score the lead
    console.log('Step 1: Scoring lead...');
    const scoreResponse = await ScoreLead(formData);
    console.log('Score response:', scoreResponse);
    
    const aiScore = scoreResponse.score || 50; // Fallback score
    console.log('AI Score:', aiScore);

    // 2. Prepare lead data
    const leadData = {
      ...formData,
      estimated_value: Number(formData.estimated_value) || 0,
      lead_score: aiScore,
    };
    console.log('Lead data to create:', leadData);

    // 3. Create the lead
    console.log('Step 2: Creating lead in database...');
    const createResponse = await Lead.create(leadData);
    console.log('Create response:', createResponse);
    
    // 4. Check if creation was successful
    if (createResponse && createResponse.success) {
      console.log('✅ Lead created successfully!');
      console.log('Step 3: Calling onLeadAdded to refresh list...');
      onLeadAdded(); // This should refresh the leads list
      handleClose(); // This should close the dialog
    } else {
      console.error('❌ Lead creation failed - no success flag');
      console.error('Response was:', createResponse);
      alert('Failed to create lead. Check console for details.');
    }
  } catch (error) {
    console.error('❌ Error in handleSubmit:', error);
    console.error('Error details:', error.message);
    alert(`Error creating lead: ${error.message}`);
  } finally {
    console.log('=== Lead Creation Process Complete ===');
    setIsSubmitting(false);
  }
};

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Lead</DialogTitle>
          <DialogDescription>
            Enter the details of the new lead to add them to your pipeline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" name="position" value={formData.position} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" name="industry" value={formData.industry} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <Select name="company_size" value={formData.company_size} onValueChange={(value) => handleSelectChange('company_size', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-1000">201-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="estimated_value">Estimated Value ($)</Label>
              <Input id="estimated_value" name="estimated_value" type="number" value={formData.estimated_value} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Any relevant information..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Adding...' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}